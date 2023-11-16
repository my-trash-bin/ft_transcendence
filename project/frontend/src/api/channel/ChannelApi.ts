import { gql } from '@apollo/client';

export const GET_ALL_CHANNELS = gql`
  query allChannel {
    allChannel {
      channelName
      latestTime
      preViewMessage
      min
      max
    }
  }
`;
