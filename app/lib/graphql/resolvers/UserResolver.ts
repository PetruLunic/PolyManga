import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {User, UserSignIn, UserSignUp} from "@/app/lib/graphql/schema";
import UserModel from "@/app/lib/models/User";
import bcrypt from "bcryptjs";
import {GraphQLError} from "graphql/error";
import {UserSchema} from "@/app/lib/utils/zodSchemas";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, {nullable: true})
  async signIn(@Arg("user") userInput: UserSignIn) {
    const user = await UserModel.findOne({ email: userInput.email }).lean();

    if (!user) {
      throw new GraphQLError("Email or password are incorrect", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (user.provider !== "CREDENTIALS") {
      throw new GraphQLError("You can sign in only with credentials", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (!bcrypt.compareSync(userInput.password, user.password)) {
      throw new GraphQLError("Email or password are incorrect", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return user;
  }

  @Mutation(() => User, {nullable: true})
  async signUp(@Arg("user") userInput: UserSignUp) {
    const emailUser = await UserModel.findOne({ email: userInput.email }).lean();

    if (emailUser) {
      throw new GraphQLError("User with this email already exists", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const nameUser = await UserModel.findOne({name: userInput.name}).lean();

    if (nameUser) {
      throw new GraphQLError("User with this name already exists", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const isValid = UserSchema.safeParse(userInput);

    if (!isValid.success) {
      throw new GraphQLError(isValid.error.errors[0].message, {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const hashedPassword = bcrypt.hashSync(userInput.password, 7);

    const newUser = new UserModel({...userInput, password: hashedPassword});
    await newUser.save();

    return newUser;
  }
}