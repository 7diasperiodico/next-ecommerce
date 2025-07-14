 import { defineOneEntry } from 'oneentry';

 import retrieveRefreshToken from '@/action/auth/retrieveRefreshToken';

 import storeRefreshToken from '@/action/auth/storeRefreshToken';

 export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

 let apiClient: ApiClientType = null;

 async function setupApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
    // Retrieve the API URL from environment variables

    const apiUrl = process.env.ONEENTRY_PROJECT_URL;

    //Throw an error if the API URL is not defined

    if (!apiUrl) {
        throw new Error ('ONEENTRY_PROJECT_URL IS missing');
    }

    // Check if the API client is alredy initialized

    if (!apiClient) {
        try {
            // Retrieve the refresh token (if avaiable) from storage

            const refreshToken = await retrieveRefreshToken();

            // Create a new instance of the API  client whit the required configuration

            apiClient = defineOneEntry(apiUrl, {
                token: process.env.ONEENTRY_TOKEN, // Token for authentication

                langCode: 'en_US', //Language code for the API

                auth: {
                    refreshToken: refreshToken || undefined, // Use the retrieved refresh token or `undefined`

                    customAuth: false, // Disable custom authentication

                    saveFunction: async (newToken: string) => {
                        // Save the new refresh token when it is updated

                        await storeRefreshToken(newToken);
                    },
                },
              });
        } catch (error) {
            // Log an error if there is an issue retrieving the resfresh token

            console.error('Error fetching refresh token:', error);
        }
    }
 
    //If the API client is still not initialized, throw an error

    if (!apiClient) {
        throw new Error ('Failed to initialize API client');
    }

    // Return the initialized API client

    return apiClient;
}

export async function fetchApiClient(): Promise<
ReturnType<typeof defineOneEntry>
>{
    // Check if the API client is alredy initialized

    if (!apiClient) {
        // If not, initialize it

        await setupApiClient();
    }

    // At this point, 'apiClient' should not be null. If it is, throw an error.

    if (!apiClient) {
        throw new Error ('API client is still null after setup')
    }

    // Return the initialized API client

    return apiClient;
}