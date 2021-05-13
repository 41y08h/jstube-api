import RatingStatus from "../types/RatingStatus";

export default interface IRatingDetails {
  likes: number;
  dislikes: number;
  userStatus: RatingStatus | undefined;
}
