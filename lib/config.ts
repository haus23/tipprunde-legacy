export const config = {
  firebaseSvcAccount: {
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  cacheAge: {
    // Often changed items (matches, tips, members)
    short: 60 * 60,
    // Stable items (championships, teams, leagues, accounts )
    long: 24 * 60 * 60,
  },
};
