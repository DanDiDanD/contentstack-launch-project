import Contentstack, { Region } from "contentstack";
import * as Utils from "@contentstack/utils";
import { HomePage, Post } from "../types";

const apiKey = process.env.CONTENTSTACK_API_KEY!;
const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN!;
const environment = process.env.CONTENTSTACK_ENVIRONMENT!;
const regionEnv = process.env.CONTENTSTACK_REGION || "na";

const Stack = Contentstack.Stack({
  api_key: apiKey,
  delivery_token: deliveryToken,
  environment,
  region: regionEnv ? (Region as any)[regionEnv] : undefined,
});

export async function getHome(): Promise<HomePage> {
  const Query = Stack.ContentType("home_page")
    .Query()
    .includeReference("featured_post")
    .toJSON();
  const [entries] = await Query.find();
  return entries?.[0] ?? null;
}

export async function getPosts(params?: {
  limit?: number;
  skip?: number;
  withAuthor?: boolean;
}) {
  const { limit = 12, skip = 0, withAuthor = true } = params ?? {};

  const Query = (Stack.ContentType("post").Query() as any)
    .orderByDescending("publish_date")
    .limit(limit)
    .skip(skip);

  if (withAuthor) Query.includeReference(["author"]);

  const [entries, count] = await Query.toJSON().find();
  return { entries: (entries as Post[]) ?? [], count: count ?? 0 };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const Query = Stack.ContentType("post")
    .Query()
    .where("slug", slug)
    .includeReference(["author"])
    .toJSON();

  const [entries] = await Query.find();
  const post = (entries?.[0] as Post) ?? null;

  if (post) {
    Utils.jsonToHTML({
      entry: post,
      paths: ["content"],
    });
  }

  return post;
}

export async function getPost(slugOrUid: string): Promise<Post | null> {
  try {
    // First try by slug
    let post = await getPostBySlug(slugOrUid);

    // If not found, try by uid
    if (!post) {
      const Query = Stack.ContentType("post")
        .Query()
        .where("uid", slugOrUid)
        .includeReference(["author"])
        .toJSON();

      const [entries] = await Query.find();
      post = (entries?.[0] as Post) ?? null;

      if (post) {
        Utils.jsonToHTML({
          entry: post,
          paths: ["content"],
        });
      }
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
