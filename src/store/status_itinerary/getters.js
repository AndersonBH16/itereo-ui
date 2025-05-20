import { ITINERARY_STATUS_OPTIONS } from "@/constants/itinerary";

export default {
  getStatusesItinerary(state) {
    return state.status_itinerary.map((itineraryStatus) => {
      const name =
        itineraryStatus.id === ITINERARY_STATUS_OPTIONS.QUOTE.id
          ? ITINERARY_STATUS_OPTIONS.QUOTE.text
          : itineraryStatus.id === ITINERARY_STATUS_OPTIONS.CANCEL.id
          ? ITINERARY_STATUS_OPTIONS.CANCEL.text
          : itineraryStatus.id === ITINERARY_STATUS_OPTIONS.SENT.id
          ? ITINERARY_STATUS_OPTIONS.SENT.text
          : itineraryStatus.id === ITINERARY_STATUS_OPTIONS.CONFIRM.id
          ? ITINERARY_STATUS_OPTIONS.CONFIRM.text
          : "";
      return {
        ...itineraryStatus,
        name,
      };
    });
  },
};
