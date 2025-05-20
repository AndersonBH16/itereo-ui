import { REQUEST_STAGES_ARRAY } from "@/constants/itinerary";

export default {
  getRequests: (state) => state.requests,
  getRequest: (state) => state.request,
  getQuoteToLinkToRequest: (state) => state.quoteToLinkToRequest,
  getRequestStages: () => REQUEST_STAGES_ARRAY,
};
