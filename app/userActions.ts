"use server"

import createApolloClient from "@/app/lib/utils/apollo-client";
import {SIGN_UP} from "@/app/lib/graphql/mutations";
import {User, UserSignIn, UserSignUp} from "@/app/lib/graphql/schema";
import {isGraphQLErrors} from "@/app/lib/utils/errorsNarrowing";
import {signIn as authSignIn} from "@/auth";
import {SIGN_IN} from "@/app/lib/graphql/queries";
import UserModel from "@/app/lib/models/User";
import dbConnect from "@/app/lib/utils/dbConnect";
import {nanoid} from "nanoid";
import bcrypt from "bcryptjs";
import {sendEmail} from "@/app/lib/utils/sendEmail";
import {getEmailVerifyTemplate} from "@/app/lib/htmls/getEmailVerifyTemplate";
import {HydratedDocument} from "mongoose";
import {getForgotPasswordEmailTemplate} from "@/app/lib/htmls/getForgotPasswordTemplate";

type ResponseType = {success: boolean, message: string};

export const signUp = async (user: UserSignUp): Promise<ResponseType> => {
  try {
    const client = createApolloClient();
    const {data, errors} = await client.mutate({
      mutation: SIGN_UP, variables: {user}
    });

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return { success: false, message: errors[0].message };
    }

    if (!data || !data.signUp) {
      console.error('No data returned from mutation');
      return { success: false, message: 'No response from server' };
    }

    await generateAndSendEmailToken(user.email, "verifyEmail");

    return {success: true, message: "User was created successfully"};
  } catch(e) {
    console.error(e);

    if (isGraphQLErrors(e)) {
      return {success: false, message: e.graphQLErrors[0].message}
    }

    return {success: false, message: "Unexpected error!"}
  }
}

export const signIn = async (user: UserSignIn):  Promise<ResponseType> => {
  try {
    const client = createApolloClient();
    const {data, errors} = await client.query({
      query: SIGN_IN, variables: {user}
    });

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return { success: false, message: errors[0].message };
    }

    if (!data || !data.signIn) {
      console.error('No data returned from query');
      return { success: false, message: 'No response from query' };
    }

    // If email was not verified
    if (!data.signIn.emailVerified) {
      await generateAndSendEmailToken(user.email, "verifyEmail");
      return {success: false, message: "Unverified email"};
    }

    await authSignIn("credentials", {
      ...data.signIn,
      preferences: JSON.stringify(data.signIn.preferences),
      redirect: false
    });

    return {success: true, message: "Successful sign in"};
  } catch(e) {
    console.error(e);

    if (isGraphQLErrors(e)) {
      return {success: false, message: e.graphQLErrors[0].message}
    }

    return {success: false, message: "Unexpected error!"}
  }
}

export const verifyEmailAndSignIn = async (email: string, token: string): Promise<{success: boolean, message: string}> => {
  try {
    await dbConnect();

    const user: HydratedDocument<User> | null = await UserModel.findOne({ email });

    if (!user) return {success: false, message: "User not found!"};

    if (user.provider !== "CREDENTIALS")
      return {success: false, message: `You can not verify token for ${user.provider.toLowerCase()} signed in account`};

    // If token is incorrect
    if (user.emailToken !== token)
      return {success: false, message: "This token is incorrect!"};

    // If token has expired
    if (new Date(user.emailTokenExpiry) < new Date())
      return {success: false, message: "Email token has expired!"};

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
    return {success: false, message: "Unexpected error!"}
  }
}

const TOKEN_TIME_LIMIT = 5; // minutes

export type EmailType = "verifyEmail" | "forgotPassword";

export const generateAndSendEmailToken = async (email: string, type: EmailType): Promise<ResponseType> => {
  try {
    await dbConnect();

    const user: HydratedDocument<User> | null = await UserModel.findOne({ email });

    if (!user) return {success: false, message: "User not found!"};

    if (user.provider !== "CREDENTIALS")
      return {success: false, message: `You can not generate token for ${user.provider.toLowerCase()} signed in account`};

    // Does not create new token if time of the token didn't expire
    const token = new Date(user.emailTokenExpiry) > new Date()
        ? user.emailToken
        : nanoid(6)

    user.emailToken = token;
    user.emailTokenExpiry = new Date(new Date().setMinutes(new Date().getMinutes() + TOKEN_TIME_LIMIT)).toISOString();
    await user.save();

    let emailTitle = "";
    let emailHtml = "";

    switch (type) {
      case "verifyEmail":
        emailTitle = "Verify Email";
        emailHtml = getEmailVerifyTemplate(token);
        break;

      case "forgotPassword":
        emailTitle = "Reset Password";
        emailHtml = getForgotPasswordEmailTemplate(token);
        break;
    }

    await sendEmail(email, emailTitle, emailHtml);

    return {success: true, message: "Token was sent to the email"};
  } catch(e) {
    console.error(e);
    return {success: false, message: "Unexpected error!"}
  }
}

export const resetPasswordAndSignIn = async (email: string, newPassword: string, token: string): Promise<ResponseType> => {
  try {
    await dbConnect();

    const user: HydratedDocument<User> | null = await UserModel.findOne({ email });

    if (!user) return {success: false, message: "User not found!"};

    if (user.provider !== "CREDENTIALS")
      return {success: false, message: `You can not reset the password for ${user.provider.toLowerCase()} signed in account`};

    // If token is incorrect
    if (user.emailToken !== token)
      return {success: false, message: "This token is incorrect!"};

    // If token has expired
    if (new Date(user.emailTokenExpiry) < new Date())
      return {success: false, message: "Email token has expired!"};

    user.password = bcrypt.hashSync(newPassword, 7);
    await user.save();

    await authSignIn("credentials", {
      redirect: false,
      ...user.toObject()
    })

    return {success: true, message: "Password was changed successfully"};
  } catch(e) {
    console.error(e);
    return {success: false, message: "Unexpected error!"}
  }
}