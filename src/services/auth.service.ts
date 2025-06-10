export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verifier s'il existe
  // creer l'utilisateur
  // creer un token
  // envoyer un email
  // creer une session
  // refresh et access token
  // return user & tokens
};
