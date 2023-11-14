import { gql } from '@apollo/client';

export const GET_FRIENDS = gql`
  query getFriend {
    friend {
      nickname
      profileImageUrl
    }
  }
`;
