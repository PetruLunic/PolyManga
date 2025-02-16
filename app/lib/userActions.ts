"use server"

import createApolloClient from "@/app/lib/utils/apollo-client";
import {SIGN_UP} from "@/app/lib/graphql/mutations";
import {User, UserSignIn, UserSignUp} from "@/app/lib/graphql/schema";
import jwt, {JwtPayload} from "jsonwebtoken";
import {isGraphQLErrorsWithLocaleKey} from "@/app/lib/utils/errorsNarrowing";
import {signIn as authSignIn} from "@/auth";
import {SIGN_IN} from "@/app/lib/graphql/queries";
import UserModel from "@/app/lib/models/User";
import dbConnect from "@/app/lib/utils/dbConnect";
import bcrypt from "bcryptjs";
import {sendEmail} from "@/app/lib/utils/sendEmail";
import {getEmailVerifyTemplate} from "@/app/lib/htmls/getEmailVerifyTemplate";
import {HydratedDocument} from "mongoose";
import {getPasswordResetTemplate} from "@/app/lib/htmls/getForgotPasswordTemplate";
import {getTranslations} from "next-intl/server";
import {PasswordSchema} from "@/app/lib/utils/zodSchemas";

type ResponseType = {success: boolean, message: string};

export const signUp = async (user: UserSignUp): Promise<ResponseType> => {
  const t = await getTranslations("server.user");

  try {
    const client = createApolloClient();
    const {data, errors} = await client.mutate({
      mutation: SIGN_UP, variables: {user}
    });

    if (errors) {
      if (errors[0].extensions?.localeKey) {
        return {success: false, message: t(errors[0].extensions?.localeKey)}
      }

      console.error('GraphQL Errors:', errors);
      return { success: false, message: t("unexpectedError") };
    }

    if (!data || !data.signUp) {
      console.error('No data returned from mutation');
      return { success: false, message: t("unexpectedError") };
    }

    await generateAndSendEmailToken(user.email, "verifyEmail");

    return {success: true, message: "User was created successfully"};
  } catch(e) {
    console.error(e);

    if (isGraphQLErrorsWithLocaleKey(e)) {
      return {success: false, message: t(e.graphQLErrors[0].extensions.localeKey)}
    }

    return {success: false, message: t("unexpectedError")}
  }
}

export const signIn = async (user: UserSignIn):  Promise<ResponseType> => {
  const t = await getTranslations("server.user");

  try {
    const client = createApolloClient();
    const {data, errors} = await client.query({
      query: SIGN_IN, variables: {user}
    });

    if (errors) {
      if (errors[0].extensions?.code === "BAD_USER_INPUT") {
        return {success: false, message: t("wrongPasswordOrEmail")}
      }
      console.error('GraphQL Errors:', errors);
      return { success: false, message: t("unexpectedError") };
    }

    if (!data || !data.signIn) {
      console.error('No data returned from query');
      return { success: false, message: t("unexpectedError") };
    }

    // If email was not verified
    if (!data.signIn.emailVerified) {
      return {success: false, message: "Unverified email"};
    }

    await authSignIn("credentials", {
      ...data.signIn,
      preferences: JSON.stringify(data.signIn.preferences),
      redirect: false
    });

    return {success: true, message: "Successful sign in"};
  } catch(e) {
    if (isGraphQLErrorsWithLocaleKey(e)) {
      return {success: false, message: t(e.graphQLErrors[0].extensions.localeKey)}
    }

    return {success: false, message: t("unexpectedError")}
  }
}

const AUTH_SECRET = process.env.AUTH_SECRET as string;

export const verifyTokenAndSignIn = async (token: string): Promise<{success: boolean, message: string}> => {
  const t = await getTranslations("server.user");

  try {
    await dbConnect();

    // Validate the JWT token. This will throw if the token is expired or invalid.
    let payload: string | JwtPayload;

    try {
      payload = jwt.verify(token, AUTH_SECRET);
    } catch (e) {
      console.error(e);
      return {success: false, message: t("incorrectToken")};
    }

    if (typeof payload !== "object") return {success: false, message: t("incorrectToken")};

    const {type, email} = payload;

    if (typeof email !== "string" && type !== "verifyEmail") {
      return {success: false, message: t("incorrectToken")};
    }

    const user: HydratedDocument<User> | null = await UserModel.findOne({email});

    if (!user) return {success: false, message: t("userNotFound")};

    if (user.provider !== "CREDENTIALS")
      return {success: false, message: t("userNotFound")};

    user.emailVerified = true;
    await user.save();

    await authSignIn("credentials", {
      redirect: false,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      preferences: JSON.stringify(user.preferences)
    })

    return {success: true, message: "Email verified successfully!"};
  } catch(e) {
    console.error(e);
    return {success: false, message: t("unexpectedError")}
  }
}

const TOKEN_TIME_LIMIT = 15; // Token expiry time in minutes

export const generateAndSendEmailToken = async (
  email: string,
  type: "verifyEmail" | "resetPassword"
): Promise<{ success: boolean; message: string }> => {
  const t = await getTranslations("server.user");
  const templatesT = await getTranslations("htmlTemplates");

  try {
    await dbConnect();

    const user: HydratedDocument<User> | null = await UserModel.findOne({ email });

    // Always return success to prevent user enumeration
    const safeReturn = {
      success: true,
      message: t("tokenSentIfExists") // "If the email exists, a token has been sent."
    };

    if (!user || user.provider !== "CREDENTIALS") {
      return safeReturn;
    }

    // Rest of the token generation logic...
    const tokenPayload = {
      email,
      type,
    };

    const token = jwt.sign(tokenPayload, AUTH_SECRET, {
      expiresIn: `${TOKEN_TIME_LIMIT}m`,
    });

    let emailTitle = "";
    let emailHtml = "";

    switch (type) {
      case "verifyEmail":
        emailTitle = templatesT("emailVerification.title");
        emailHtml = await getEmailVerifyTemplate(token, user.name);
        break;
      case "resetPassword":
        emailTitle = templatesT("passwordReset.title");
        emailHtml = await getPasswordResetTemplate(token, user.name);
        break;
    }

    // Add random delay to prevent timing attacks
    await Promise.all([
      sendEmail(email, emailTitle, emailHtml),
      new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
    ]);

    return safeReturn;
  } catch (e) {
    console.error(e);
    // Return generic error message
    return {
      success: true,
      message: t("tokenSentIfExists")
    };
  }
};


export const resetPasswordAndSignIn = async (newPassword: string, token: string): Promise<ResponseType> => {
  const t = await getTranslations("server.user");

  try {
    await dbConnect();

    // Validate password
    const validationResult = PasswordSchema.safeParse(newPassword);

    if (!validationResult.success) {
      return {success: false, message: validationResult.error.flatten().formErrors[0]};
    }

    // Validate the JWT token. This will throw if the token is expired or invalid.
    let payload: string | JwtPayload;

    try {
      payload = jwt.verify(token, AUTH_SECRET);
    } catch (e) {
      console.error(e);
      return {success: false, message: t("incorrectToken")};
    }

    if (typeof payload !== "object") return { success: false, message: t("incorrectToken") };

    const {type, email} = payload;

    if (typeof email !== "string" && type !== "resetPassword") {
      return { success: false, message: t("incorrectToken") };
    }

    const user: HydratedDocument<User> | null = await UserModel.findOne({ email });

    if (!user) return {success: false, message: t("unexpectedError")};

    if (user.provider !== "CREDENTIALS")
      return {success: false, message: t("unexpectedError")};

    user.emailVerified = true; // Verify the email if it wasn't verified till now
    user.password = bcrypt.hashSync(newPassword, 7);
    await user.save();

    console.log({...user.toObject()});

    await authSignIn("credentials", {
      redirect: false,
      ...user.toObject(),
      preferences: JSON.stringify(user.preferences) // Stringifying object values because they throw error at JSON parse
    })

    return {success: true, message: "Password was changed successfully"};
  } catch(e) {
    console.error(e);
    return {success: false, message: t("unexpectedError")}
  }
}