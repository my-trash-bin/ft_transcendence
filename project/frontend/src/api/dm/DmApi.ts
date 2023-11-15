import { gql } from '@apollo/client';

export const GET_DM_USERS = gql`
  query getDmUsers {
    dmUser {
      latestTime
      preViewMessage
      nickname
      profileImageUrl
    }
  }
`;
