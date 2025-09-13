export interface Post {
    id: string;
    author: { username: string };
    title: string;
    description: string;
    imageId: string;
    imageUrl: string;
    upvoted: boolean;
    upvoteCount: number;
}
