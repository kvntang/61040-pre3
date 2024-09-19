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
    // In Express, the session is created spontaneously when the connection is first made, so we do not need
    // to explicitly allocate a session; we only need to keep track of the user.

    // TODO: Make sure the user is logged out before allowing a new session to start.
    // Hint: Take a look at how the "end" function makes sure the user is logged in. Keep in mind that a
    // synchronization like starting a session should just consist of a series of actions that may throw
    // exceptions and should not have its own control flow.
    try {
      this.isLoggedIn(session); // Check if a user is already logged in
      throw new Error(`Session already active for user ${session.user}! Please log out first.`); // Include current user in error message
    } catch (e) {
      if (e instanceof UnauthenticatedError) { // If user is not logged in (UnauthenticatedError), start the session
        session.user = username; // Start a new session by setting the user
      } else {
        throw e; // Rethrow any other error
      }
    }
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
}
