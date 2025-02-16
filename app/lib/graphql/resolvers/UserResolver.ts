import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {Bookmark, ChapterBookmark, Manga, User, UserSignIn, UserSignUp} from "@/app/lib/graphql/schema";
import UserModel from "@/app/lib/models/User";
import BookmarkModel from "@/app/lib/models/Bookmark";
import bcrypt from "bcryptjs";
import {GraphQLError} from "graphql/error";
import {UserSchema} from "@/app/lib/utils/zodSchemas";
import {type ApolloContext} from "@/app/api/graphql/route";
import ChapterBookmarkModel from "@/app/lib/models/ChapterBookmark";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, {nullable: true})
  async signIn(@Arg("user") userInput: UserSignIn) {
    const user = await UserModel.findOne({ email: userInput.email }).lean();

    if (!user) {
      throw new GraphQLError("Email or password are incorrect", {
        extensions: {
          code: "BAD_USER_INPUT",
          localeKey: "wrongPasswordOrEmail"
        }
      })
    }

    if (user.provider !== "CREDENTIALS") {
      throw new GraphQLError("Email or password are incorrect", {
        extensions: {
          code: "BAD_USER_INPUT",
          localeKey: "wrongPasswordOrEmail"
        }
      })
    }

    if (!bcrypt.compareSync(userInput.password, user.password)) {
      throw new GraphQLError("Email or password are incorrect", {
        extensions: {
          code: "BAD_USER_INPUT",
          localeKey: "wrongPasswordOrEmail"
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
          code: "BAD_USER_INPUT",
          localeKey: "existingEmail"
        }
      })
    }

    const nameUser = await UserModel.findOne({name: userInput.name}).lean();

    if (nameUser) {
      throw new GraphQLError("User with this name already exists", {
        extensions: {
          code: "BAD_USER_INPUT",
          localeKey: "existingName"
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

  @Authorized(["USER", "MODERATOR"])
  @Query(() => User, {nullable: true})
  async user(@Ctx() ctx: ApolloContext): Promise<User | null> {
    return UserModel.findOne({id: ctx.user?.id}).lean();
  }

  @FieldResolver(() => Bookmark, {nullable: true})
  async bookmarks(@Root() user: User): Promise<Bookmark | null> {
    return BookmarkModel.findOne({id: user.bookmarkId}).lean();
  }

  @FieldResolver(() => [ChapterBookmark])
  async chapterBookmarks(@Root() user: User): Promise<ChapterBookmark[]> {
    return ChapterBookmarkModel.find({userId: user.id}).lean();
  }
}