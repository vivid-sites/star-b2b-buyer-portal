import { BigCommerceStorefrontAPIBaseURL, platform } from '../../../../utils/basicConfig';

export const getVSCurrentCustomerJWT = async (app_client_id: string) => {
  if (platform !== 'bigcommerce') {
    // we can't get a JWT from BC because of CORS, so we return a pre-built JWT
    // for bbogovich@vividsites.com (customer ID 1) for the Star sandbox (euankjadea)
    // that expires on 8/26/2035
    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJjdXN0b21lciI6eyJpZCI6MSwiZW1haWwiOiJiYm9nb3ZpY2hAdml2aWRzaXRlcy5jb20iLCJncm91cF9pZCI6IjIifSwiaXNzIjoiYmMvYXBwcyIsInN1YiI6ImV1YW5ramFkZWEiLCJpYXQiOjIwNzE5MzU1NDIsImV4cCI6MjA3MTkzNTU0MiwidmVyc2lvbiI6MSwiYXVkIjoicmV3ZmVhNm05ZW5senMxZWxxNmM1aWZkaHo5cm1lOCIsImFwcGxpY2F0aW9uX2lkIjoicmV3ZmVhNm05ZW5senMxZWxxNmM1aWZkaHo5cm1lOCIsInN0b3JlX2hhc2giOiJldWFua2phZGVhIiwib3BlcmF0aW9uIjoiY3VycmVudF9jdXN0b21lciJ9.K8TUdAmGcMtJsk4JaSc7Ds25ijDBpy_787pIkLC-sJl6XpXXniTM_4SYjGFKkDvUKK00OS0MDsPXqR26RxrKKQ";
  }
  const response = await fetch(
    `${BigCommerceStorefrontAPIBaseURL}/customer/current.jwt?app_client_id=${app_client_id}`,
  );
  const bcToken = await response.text();
  if (!response.ok) {
    if (bcToken.includes('errors')) {
      return undefined;
    }
    throw new Error(response.statusText);
  }
  return bcToken;
};