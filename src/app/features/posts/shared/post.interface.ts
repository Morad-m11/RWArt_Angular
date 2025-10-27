export type TagCategory = 'type' | 'character' | 'style';

export interface Tag {
    category: TagCategory;
    name: string;
}

export interface Post {
    id: string;
    author: { username: string; picture: string };
    title: string;
    description: string;
    tags: Tag[];
    imageId: string;
    upvoteCount: number;
    isUpvoted: boolean;
    isOwner: boolean;
}

export type CreatePost = Pick<Post, 'title' | 'description' | 'tags'> & {
    image: File;
};
