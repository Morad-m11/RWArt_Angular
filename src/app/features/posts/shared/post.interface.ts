export interface Post {
    id: string;
    author: { username: string };
    title: string;
    description: string;
    imageId: string;
    imageUrl: string;
    upvoteCount: number;
    isUpvoted: boolean;
    isOwner: boolean;
}
