import { Publication } from "@shared/schema";

export interface PublicationWithId extends Publication {
  _id: string;
}