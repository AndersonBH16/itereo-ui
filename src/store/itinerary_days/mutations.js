// import { addDays, format, parse } from 'date-fns';

export default {
  SET_IS_LOADING(state, payload) {
    state.isLoading = payload;
  },
  SET_ITINERARY_DAYS_DATA(state, data) {
    state.itineraryDays = data;
  },
  SET_TEMPLATE_ITINERARY_DAYS_DATA(state, data) {
    state.templateItineraryDays = data;
  },
  SET_GENERATED_DAYS(state, data) {
    state.generatedDays = data;
  },
  // TEMP_ADD_A_DAY(state, payload) {
  //   const { index, data } = payload;
  //   const indexAfterSelectedDay = index + 1;
  //   state.itineraryDays.splice(indexAfterSelectedDay, 0, data);
  // },
  TEMP_EDIT_A_DAY(state, payload) {
    console.log(payload);
  },
  TEMP_REMOVE_A_DAY(state, payload) {
    const { index } = payload;
    const sourceDay = state.itineraryDays[index];
    sourceDay.status = -1;
  },
  SET_TOTAL_ITINERARY_DAYS(state, payload) {
    state.totalItineraryDays = payload;
  },
  // TEMP_REFRESH_ORDER_DAYS(state) {
  //   let counterDays = 0;
  //   state.itineraryDays = state.itineraryDays.map((day) => {
  //     counterDays += 1;
  //     day.start_day = counterDays;
  //     return day;
  //   });
  // },
  // TEMP_REFRESH_DATE_DAYS(state, payload) {
  //   let counterDate = payload.itinerary.start_date;
  //   state.itineraryDays = state.itineraryDays.map((day) => {
  //     const parsedDate = parse(counterDate, "yyyy-MM-dd", new Date());
  //     if (state.itineraryDays.length > 0) {
  //       counterDate = addDays(new Date(parsedDate), 1);
  //       const formattedDate = format(new Date(counterDate), "YYYY-MM-DD");
  //       day.start_date = formattedDate;
  //     } else {
  //       day.start_date = counterDate;
  //     }
  //     return day;
  //   });
  // },
};

// TEMP_REFRESH_DATE_DAYS (state, payload) {
//     const indexItinerary = state.itinerarySourceTypeSelected.index
//     const sourceFromItinerary = state.opportunitySource.itineraries[indexItinerary]['fromitinerary']
//     let tempDate = parse(sourceFromItinerary, 'yyyyy-MM-dd', new Date())
//
//     state.opportunitySource.itineraries[indexItinerary].days.forEach((day, index) => {
//       const sourceDay = state.opportunitySource.itineraries[indexItinerary].days[index]
//       if (index > 0) {
//         sourceDay.startdate = formatDate(addDays(tempDate, 1))
//         tempDate = parse(sourceDay.startdate, 'yyyyy-MM-dd', new Date())
//       } else {
//         sourceDay.startdate = formatDate(tempDate)
//       }
//     })
