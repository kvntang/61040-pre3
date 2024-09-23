import { SessionData } from "express-session";
import { UnauthenticatedError } from "./errors";

export type SessionDoc = SessionData;

// This allows us to overload express session data type.
// Express session does not support non-string values over requests.
// We'll be using this to store the user _id in the session.
declare module "express-session" {
  export interface SessionData {
    user?: string;
  }
}

/**
 * concept: Sessioning [User]
 */
export default class SessioningConcept {
  start(session: SessionDoc, username: string) {
    this.isLoggedOut(session);
    session.user = username;

  }

  end(session: SessionDoc) {
    this.isLoggedIn(session); //check if the user is logged in
    session.user = undefined; //end the session
  }

  getUser(session: SessionDoc) {
    this.isLoggedIn(session); //check if the user is logged in
    return session.user!; //return the user
  }

  isLoggedIn(session: SessionDoc) {
    if (session.user === undefined) { //if no user is logged in
      throw new UnauthenticatedError("Must be logged in!"); //throw an error
    }
  }

  isLoggedOut(session: SessionDoc) {
    if (session.user !== undefined) { //if a user is logged in
      throw new Error(`User ${session.user} is logged in! Please log out first.`); //throw an error
    }
  }
}
