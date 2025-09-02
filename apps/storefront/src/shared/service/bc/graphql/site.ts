import B3Request from '../../request/b3Fetch';

const getStoreAddressQuery = () => `query storeAddress {
  site {
    settings {
      contact {
        address
        phone
      }
      storeName
    }
  }
}`;

const getStoreAddress = () =>
  B3Request.graphqlBCProxy({
    query: getStoreAddressQuery(),
  });

export { getStoreAddress };
