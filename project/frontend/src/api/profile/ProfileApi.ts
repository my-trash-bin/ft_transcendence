import { gql } from '@apollo/client';

export const GET_PROFILES = gql`
  query profile {
    profile {
      profileImageUrl
      nickname
      win
      lose
      ratio
      statusMessage
    }
  }
`;
