export interface Post {
    id: string;
    author: { username: string };
    title: string;
    description: string;
    tags: Tag[];
    imageId: string;
    upvoteCount: number;
    isUpvoted: boolean;
    isOwner: boolean;
}

export interface Tag {
    id: number;
    name: string;
    category?: string;
}
