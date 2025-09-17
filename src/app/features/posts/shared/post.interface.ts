export interface Post {
    id: string;
    author: { username: string };
    title: string;
    description: string;
    tags: string[];
    imageId: string;
    imageUrl: string;
    upvoteCount: number;
    isUpvoted: boolean;
    isOwner: boolean;
}
