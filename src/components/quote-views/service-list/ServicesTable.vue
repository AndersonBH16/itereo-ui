<template>
  <div
    class="table-box tableServiceTable"
    :data-test-id="constants.DATA_TEST_ID_VALUES.SERVICES_TABLE"
  >
    <GuideBox
      title="Adding a new service"
      description="Well done, you have added a service to your quotation"
      :step="23"
      :positionX="-20"
      :positionY="-150"
      :showBackButton="false"
    />
    <GuideBox
      title="Adding a new service"
      description="Choose a country related to the service"
      :step="26"
      :positionX="60"
      :positionY="10"
      :showNextButton="newService.country !== null"
    />
    <GuideBox
      title="Adding a new service"
      description="Choose a destination related to the service"
      :step="27"
      :positionX="160"
      :positionY="10"
      v-if="!loading"
      :showNextButton="newService.location !== null"
    />
    <GuideBox
      title="Adding a new service"
      description="Choose a type of service"
      :step="28"
      :positionX="280"
      :positionY="40"
      v-if="!loading"
      :showNextButton="newService.id_service_type !== null"
    />
    <GuideBox
      title="Adding a new service"
      description="Choose a service"
      :step="29"
      :positionX="400"
      :positionY="40"
      v-if="!loading"
      :showNextButton="newService.service !== null"
    />
    <ServicesUpdateDateModals
      :openModal="openModal"
      :action="updateServicesItineraryDatesAndSave"
      :message="modalMessage"
      :handleOpenModal="handleOpenModal"
    />
    <BaseModal
      :isComponentModalActive="removeService"
      :closeModal="() => handleRemoveService()"
      :cancel="cancel"
    >
      <IconWarning slot="icon" class="icon is-xsmall color-12" />
      <span slot="title">Your current changes will not be saved</span>
      <span slot="paragraph"
        >Are you sure to
        <span class="has-text-weight-semibold">remove</span> this service?
      </span>
      <div slot="buttons" class="is-flex">
        <BaseButton
          @click="handleRemoveService()"
          action="secondary"
          size="medium"
          class="mr-4"
        >
          <p slot="text">No, take me back</p>
        </BaseButton>
        <BaseButton
          @click="removeItem(servicesItinerary.length - 1)"
          action="tercery"
          size="medium"
        >
          <p slot="text">Yes, continue</p>
        </BaseButton>
      </div>
    </BaseModal>
    <div class="columns serviceHeader">
      <h2 class="is-h2 mr-2 p-1 pb-3"><strong>Services</strong></h2>
    </div>
    <AddServicesModal
      :class="`basicInfoAdd AddServicesButton ${
        localSaving.isActive ? 'hide' : ''
      }`"
      :localSaving="localSaving"
      :currentRow="currentRow"
      :createItineraryServiceForm="createItineraryServiceForm"
      :createItineraryService="createItineraryService"
      :dispatchServicesItinerary="dispatchServicesItinerary"
      :getDestinationsPerCountry="getDestinationsPerCountry"
      :getServicePrice="getServicePrice"
      :getServices="getServices"
      :handleSearchServicesContract="handleSearchServicesContract"
      :handleSearchServices="handleSearchServices"
      :handleRemoveService="handleRemoveService"
      :handleModalExitService="handleModalExitService"
      :handleModalShortcuts="handleModalShortcuts"
      :handleValidateIsEditing="handleValidateIsEditing"
      :hideBasicInfo="hideBasicInfo"
      :handleModalPreventCreateService="handleModalPreventCreateService"
      :modalPreventExitService="modalPreventExitService"
      :modalPreventCreateService="modalPreventCreateService"
      :newService="newService"
      :handleModalEditServiceModal="handleModalEditServiceModal"
      :openServiceSelectModal="openServiceSelectModal"
      :removeItem="removeItem"
      :removeService="removeService"
      :rowSelected="rowSelected"
      :setLoading="setLoading"
      :loadNewServiceAndSearchServicesPayload="
        loadNewServiceAndSearchServicesPayload
      "
      :loadServiceInformationFromLocalStorage="
        loadServiceInformationFromLocalStorage
      "
      :setRoomsSelectedAccomPack="setRoomsSelectedAccomPack"
      :shortcutsOpen="shortcutsOpen"
      :getLocationCountry="getLocationCountry"
      :updateSearchServicesPayload="updateSearchServicesPayload"
      :validateIsEditing="validateIsEditing"
      :updateNewServiceItineraryForm="updateNewServiceItineraryForm"
      :setNewServiceData="setNewServiceData"
      :addServiceByCode="addServiceByCode"
      :preventCreateNewService="preventCreateNewService"
      :updateServiceViewState="updateServiceViewState"
    />
    <ServiceTableFilters
      :fields="fields"
      :resetLocalSaving="resetLocalSaving"
      @updateFilteredItineraryServices="updateFilteredItineraryServices"
      @updateFields="updateFields"
    />
    <SkeletonServicesTable v-if="loadingSkeleton" :loading="loadingSkeleton" />
    <div class="service_table__container" v-else>
      <b-editable-table
        bordered
        hover
        selectable
        select-mode="single"
        :small="true"
        :items="servicesItinerary"
        :fields="fields"
        :rowUpdate="rowUpdate"
        @input-change="handleEditMultipleRows"
        :class="focusedGuideBoxClass(getEditableTableClass(), [23, 31], true)"
        @row-selected="onRowSelected"
        :isDateGuideStep="isDateGuideStep()"
      >
        <template #cell(selected)="data">
          <b-checkbox
            v-model="data.item.selected"
            size="is-small"
            class="ml-2"
            @input="() => onSelectedChange(data)"
          >
          </b-checkbox>
        </template>

        <template #cell(visible)="data">
          <b-field>
            <span v-if="data.value">Yes</span>
            <span v-else>No</span>
          </b-field>
        </template>

        <template #cell(day)="data">
          <span
            :class="
              servicesLoading.isLoading
                ? 'principal blueColor disabled_field'
                : 'principal blueColor'
            "
            @click="
              (event) => validateClickOnCell(servicesLoading.isLoading, event)
            "
            >{{ data.value }}</span
          >
        </template>

        <template #cell(dates)="data">
          <div
            :class="
              servicesLoading.isLoading
                ? 'dates_field_container disabled_field'
                : 'dates_field_container'
            "
          >
            <div class="datepicker_container">
              <b-datepicker
                placeholder="Select dates..."
                size="is-small"
                :ref="`datepicker${data.index}`"
                v-model="data.item.dates"
                @input="saveSelectedDates(data, $event)"
                :range="hasRangeSelection(data.item)"
                :mobile-native="false"
              >
              </b-datepicker>
            </div>
            <span
              @click="
                (event) => {
                  validateClickOnCell(servicesLoading.isLoading, event, () =>
                    openDatepickerByRef(`datepicker${data.index}`)
                  );
                }
              "
              class="dates_select_button"
            >
              {{
                hasDateRange(data.item)
                  ? helpers.format(data.item.dates[0], datesFormat)
                  : helpers.format(data.item.start_date, datesFormat)
              }}
              <br />
              <span
                :class="
                  helpers.isDraftService(data.item) ||
                  helpers.isPackageService(data.item.id_service_type)
                    ? 'disabled_field'
                    : ''
                "
              >
                {{
                  hasDateRange(data.item) &&
                  data.item.start_date !== data.item.end_date
                    ? helpers.format(data.item.dates[1], datesFormat)
                    : ""
                }}
              </span>
            </span>
          </div>
        </template>

        <template #cell(destination)="data">
          <BaseSelect
            v-if="helpers.isDraftService(data.item)"
            size="medium"
            :list="countries"
            optionValue="location_name"
            :customText="destinationText"
            placeholder="Country"
            :value="newService.country"
            @input="
              setNewServiceLocationByCountry($event);
              resetServicesResults();
              getDestinationsPerCountry($event);
              setItemToLocalStorage($route.query.itinerary, {
                ...JSON.parse(localStorage.getItem($route.query.itinerary)),
                country: $event,
              });
              nextStep();
            "
            :class="focusedGuideBoxClass('', 26)"
          />
          <BaseSelect
            v-if="helpers.isDraftService(data.item)"
            size="medium"
            :list="destinationsByCountry"
            optionValue="location_code"
            optionText="text"
            placeholder="Destination"
            :disabled="destinationsByCountry.length === 0"
            :value="newService.location"
            @input="
              newService.location = $event;
              setItemToLocalStorage($route.query.itinerary, {
                ...JSON.parse(localStorage.getItem($route.query.itinerary)),
                location: $event,
              });
              nextStep();
            "
            :class="focusedGuideBoxClass('', 27)"
          />
          <div v-else-if="data.item">
            <div v-if="data.item.location.length > 0">
              <span>
                {{
                  data.item.location && data.item.location.length
                    ? data.item.location[0].parent > 0
                      ? getParentLocation(
                          data.item.location[0].parent,
                          "location_name"
                        )
                      : data.item.location[0].location_name
                    : ""
                }}
              </span>
              <span
                v-for="(location, index) in getDestinations(data.item)"
                :key="index"
              >
                {{ location.location_name || "" }}
              </span>
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </div>
        </template>

        <template #cell(name)="data">
          <ServiceRowCard
            :data="data"
            :handleModalEditServiceModal="handleModalEditServiceModal"
            :openServiceSelectModal="openServiceSelectModal"
            :openServiceReplaceModal="openServiceReplaceModal"
            :stopPropagation="stopPropagation"
            :newService="newService"
            :handleClickServiceRowCard="
              (service) =>
                handleClickServiceRowCard(
                  service,
                  openSidebarPricingSection(data.item)
                )
            "
          />
          <span
            class="recentlyAffected"
            :ref="`recentlyAffected__${data.index}`"
            :data-highlight="
              highlightRow(data.item, `recentlyAffected__${data.index}`)
            "
          ></span>
        </template>

        <template #cell(level_text)="data">
          <span>{{ data.value }}</span>
        </template>

        <template #cell(num_pax)="data">
          <span
            :class="
              servicesLoading.isLoading || data.item.isGrouped
                ? 'color-up disabled_field'
                : 'color-up'
            "
            @click="
              (event) =>
                validateClickOnCell(servicesLoading.isLoading, event, () =>
                  validatePaxInput($event, data.item.isGrouped)
                )
            "
          >
            {{ data.value }}
          </span>
        </template>

        <template #cell(cost)="data">
          <span class="color-7" style="padding-right: 0.5rem">
            {{ getServiceCostCurrency(data) }}
            {{ parseFloat(data.value || 0).toFixed(2) }}
          </span>
        </template>

        <template #cell(price_unit)="data">
          <span
            :class="
              disablePriceUnitField(data.item)
                ? 'color-up disabled_field'
                : 'color-up'
            "
            @click="
              (event) =>
                validateClickOnCell(
                  isAccommodationPackageService(data.item.id_service_type) ||
                    disablePriceUnitField(data.item),
                  event
                )
            "
          >
            {{ itineraryCurrency.currency_sign }}
            {{ parseFloat(data.value || 0).toFixed(2) }}
          </span>
        </template>

        <template #cell(price)="data">
          <div
            :class="
              disablePriceField() ? 'is-relative disabled_field' : 'is-relative'
            "
            @click="(event) => validateClickOnCell(disablePriceField(), event)"
          >
            <span
              v-if="
                constants.SERVICE_OPTIONAL_TYPES.OPTIONAL === data.item.optional
              "
            >
              <span
                style="
                  border-radius: 50%;
                  background-color: #f00b81;
                  color: #fff;
                  padding: 0.1rem 0.1rem;
                "
              >
                <IconPlus class="icon is-small" style="height: 0.75rem" />
              </span>
              <span style="padding-right: 0.5rem; color: #f00b81">
                {{ itineraryCurrency.currency_sign }}
                {{ parseFloat(data.value || 0).toFixed(2) }}
              </span>
            </span>
            <span v-else :class="`color-up px-2`">
              {{ itineraryCurrency.currency_sign }}
              {{ parseFloat(data.value || 0).toFixed(2) }}
            </span>
            <CustomDotAlert
              :displayAlert="alertActivated(data.item)"
              :tooltip="alertTooltip(data.item)"
              :customStyle="`right: -20%;`"
              :type="alertType(data.item)"
              :tooltipPosition="`is-bottom`"
            />
          </div>
        </template>

        <template #cell(id)="data">
          <div
            class="is-flex is-justify-space-between is-align-items-center"
            v-if="helpers.isDraftService(data.item)"
          >
            <button
              style="border: none; background-color: transparent"
              @click="
                nextStep();
                createItineraryService(newService);
              "
              :class="focusedGuideBoxClass('mr-1', 30, true)"
              :data-test-id="
                constants.DATA_TEST_ID_VALUES.CONFIRM_SERVICES_TO_ADD_BUTTON
              "
            >
              <IconCheck class="icon color-6 is-small" />
            </button>

            <div>
              <button
                style="border: none; background-color: transparent"
                @click="handleRemoveService(true)"
              >
                <IconTrash class="icon color-8 is-small" />
              </button>
            </div>
          </div>
          <div
            class="is-flex is-justify-space-between is-align-items-center"
            v-else
          >
            <span
              v-if="data.item.serviceLoading.isLoading"
              class="loading__cell is-flex is-align-items-center is-justify-content-center"
            >
              <div>
                <clip-loader
                  :loading="true"
                  color="#032647"
                  size="20px"
                ></clip-loader>
                <p>{{ data.item.serviceLoading.message }}</p>
              </div>
            </span>
            <b-tooltip
              v-if="hasViewServiceNotesPermission"
              type="is-light"
              class="service_row__notes"
              multilined
            >
              <b-button
                @click="() => openSidebarToEditNotes(data.item)"
                style="border: none"
              >
                <b-icon
                  icon="text-box-outline"
                  size="is-small"
                  custom-size="mdi-18px"
                />
              </b-button>
              <template v-slot:content>
                <p
                  v-if="data.item.notes.value.trim().length > 0"
                  v-html="data.item.notes.value"
                  class="service_row_notes__placeholder"
                ></p>
                <p v-else style="width: 8rem">There are no notes</p>
              </template>
            </b-tooltip>
            <ServicesTableActions
              v-if="!hideElementByCondition"
              :class="[
                validateIsEditing || servicesLoading.isLoading
                  ? 'disabled'
                  : '',
              ]"
              :services_itinerary="servicesItinerary"
              :importService="importService"
              :udpateLocalSaving="udpateLocalSaving"
              :updateItineraryServicesOrder="updateItineraryServicesOrder"
              :handleSearchService="handleSearchService"
              :handleChangeTimerCount="handleChangeTimerCount"
              :handleItineraryServiceRecentlyAdded="
                handleItineraryServiceRecentlyAdded
              "
              :handleModalEditServiceModal="handleModalEditServiceModal"
              :saveItineraryServiceUpdated="saveItineraryServiceUpdated"
              :onReplaceClick="openServiceReplaceModal"
              :serviceItinerary="data.item"
              :serviceIndex="data.index"
              :setLoading="setLoading"
              :preventCreateNewService="preventCreateNewService"
              :displayServiceHistoryModal="displayServiceHistoryModal"
              :servicesItinerary="servicesItinerary"
              :dispatchServicesItinerary="dispatchServicesItinerary"
              :saveItineraryService="handleEditMultipleRows"
              :openServiceImportModal="openServiceImportModal"
              @update:selectedService="selectedService = $event"
            />
          </div>
        </template>
      </b-editable-table>
      <template
        v-if="!loading && !loadingSkeleton && servicesItinerary.length > 0"
      >
        <table class="w-100 service_table__footer">
          <tr>
            <td class="checkboxField"><div class="th-wrap"></div></td>
            <td class="day"><div class="th-wrap"></div></td>
            <td class="days"><div class="th-wrap"></div></td>
            <td class="days"><div class="th-wrap"></div></td>
            <td class="countryField"><div class="th-wrap"></div></td>
            <td class="destinationField"><div class="th-wrap"></div></td>
            <td class="serviceTypeField"><div class="th-wrap"></div></td>
            <td class="levelField"><div class="th-wrap"></div></td>
            <td class="InputCode"><div class="th-wrap"></div></td>
            <td class="InputTitle"><div class="th-wrap"></div></td>
            <td class="paxField"><div class="th-wrap"></div></td>
            <td
              v-if="hasViewSalePriceCostPricePermission"
              class="is-hidden-mobile footer-border py-2 percentageMarginField"
            >
              <div
                class="th-wrap is-numeric color-up has-text-weight-semibold"
              ></div>
            </td>
            <td
              v-if="hasViewSalePriceCostPricePermission"
              class="footer-border py-2 priceField total has-text-weight-bold"
            >
              <div class="th-wrap is-numeric color-11">
                {{ itineraryCurrency.currency_sign }}
                {{ totalPrice }}
              </div>
            </td>
            <td class="actionsField"><div class="th-wrap"></div></td>
          </tr>
        </table>
      </template>
    </div>
    <p
      v-if="!loadingSkeleton && servicesItinerary.length === 0"
      class="service_table_placeholder"
      :data-test-id="constants.DATA_TEST_ID_VALUES.SERVICES_TABLE_PLACEHOLDER"
    >
      There are no services added yet.
    </p>

    <EditServiceSideBar
      :class="[validateIsEditing ? 'disabled' : '']"
      :editServiceModal="editServiceModal"
      :getServicePrice="getServicePrice"
      :handleModalEditServiceModal="handleModalEditServiceModal"
      :handleSearchService="handleSearchService"
      :passengers_itinerary="passengers_itinerary"
      :serviceItinerary="serviceEdited"
      :setLoading="setLoading"
      :selected="selected"
      :serviceIdToEdit="serviceIdToEdit"
      :importService="importService"
      :sendItineraryServiceUpdatedToAPI="sendItineraryServiceUpdatedToAPI"
      :setEndDateToNewServiceByIdServiceType="
        setEndDateToNewServiceByIdServiceType
      "
      :setStartDateToNewServiceByIdServiceType="
        setStartDateToNewServiceByIdServiceType
      "
      :setRoomsSelectedAccomPack="setRoomsSelectedAccomPack"
      :defaultOpenedTab="defaultOpenedTab"
      :editServiceSidebarFocusedElement="editServiceSidebarFocusedElement"
      :validateFunctionExecution="validateFunctionExecution"
      :updateServiceViewState="updateServiceViewState"
      @update:updateServiceTableSkeleton="updateServiceTableSkeleton"
    />

    <ServiceSelectModal
      :isServiceSelectModalActive="isServiceSelectModalActive"
      :services="servicesWithText"
      :newService="newService"
      :currentRow="currentRow"
      :setLoading="setLoading"
      :createItineraryService="createItineraryService"
      :getFullServiceWithPrices="getFullServiceWithPrices"
      :setNewService="setNewService"
      :setFullServiceWithPrices="setFullServiceWithPrices"
      :updateSearchServicesPayload="updateSearchServicesPayload"
      :handleSearchServicesContract="handleSearchServicesContract"
      :validateServiceLocationBeforeAdding="validateServiceLocationBeforeAdding"
      @update:isServiceSelectModalActive="isServiceSelectModalActive = $event"
    />

    <ServiceReplaceModal
      :setLoading="setLoading"
      :serviceToReplace="serviceToReplace"
      :isServiceModalOpen="showServiceReplaceModal"
      :updateSearchServicesPayload="updateSearchServicesPayload"
      :handleSearchServicesContract="handleSearchServicesContract"
      :handleChangeTimerCount="handleChangeTimerCount"
      @update:updateServiceTableSkeleton="updateServiceTableSkeleton"
      @update:isOpenModal="showServiceReplaceModal = $event"
    />

    <ServiceMoveMassiveModal
      :setLoading="setLoading"
      :loadingSkeleton="loadingSkeleton"
      :serviceEdited="serviceEdited"
      :serviceMassiveOptions="serviceMassiveOptions"
      :showServiceMassiveModal="showServiceMassiveModal"
      :handleEditMultipleRows="handleEditMultipleRows"
      :resetServiceEdited="resetServiceEdited"
      :getServiceChunks="getServiceChunks"
      :handleChangeTimerCount="handleChangeTimerCount"
      :showServiceAlertsModal="showServiceAlertsModal"
      :onContinueClick="handleServiceMoveMassiveContinueClick"
      :onSecondaryActionClick="moveOnlyOneService"
      @update:updateServiceTableSkeleton="updateServiceTableSkeleton"
      @update:serviceMassiveOptions="serviceMassiveOptions = $event"
      @update:showServiceMassiveModal="showServiceMassiveModal = $event"
    />

    <ServiceInsertBetweenDestinationsModal
      :setLoading="setLoading"
      :loadingSkeleton="loadingSkeleton"
      :serviceToSave="serviceEdited"
      :previousService="previousService"
      :serviceMassiveOptions="serviceMassiveOptions"
      :showServiceInsertBetweenDestinationsModal="
        showServiceInsertBetweenDestinationsModal
      "
      :setNewService="setNewService"
      :resetServiceEdited="resetServiceEdited"
      :handleChangeTimerCount="handleChangeTimerCount"
      :clearServiceInsertBetweenDestinationsModalData="
        clearServiceInsertBetweenDestinationsModalData
      "
      @update:updateServiceTableSkeleton="updateServiceTableSkeleton"
      @update:serviceMassiveOptions="serviceMassiveOptions = $event"
      @update:showServiceInsertBetweenDestinationsModal="
        showServiceInsertBetweenDestinationsModal = $event
      "
    />

    <ServiceHistoryModal
      :isModalOpen="isServiceHistoryModalOpen"
      :serviceId="serviceIdToDisplayHistory"
      :getServiceHistory="getServiceHistory"
      @update:setIsServiceHistoryModalOpen="setIsServiceHistoryModalOpen"
    />

    <ServiceImportModal
      v-if="selectedService"
      :isModalOpen="isServiceImportModalOpen"
      :selectedService="selectedService"
      :closeModal="closeServiceImportModal"
      :onCancel="
        () => {
          this.selectedService = null;
          closeServiceImportModal();
        }
      "
      :onContinue="importService"
      @update:selectedService="selectedService = $event"
    />

    <MoveItineraryAlert
      :isModalOpen="isUpdateItineraryDatesModalOpen"
      :serviceEdited="serviceEdited"
      :moveAllServices="handleServiceMoveMassiveContinueClick"
      :getServiceChunks="getServiceChunks"
      :closeIsModalOpen="closeShowUpdateItineraryModal"
      :getDiffDays="getDiffDays"
      :setLoading="setLoading"
      @update:isModalOpen="isUpdateItineraryDatesModalOpen = $event"
    />

    <ServiceAlertsModal
      :isModalOpen="serviceImportingConfirmationModal.isOpen"
      :alertTitle="serviceImportingConfirmationModal.alertContent.title"
      :alertContent="serviceImportingConfirmationModal.alertContent.message"
      :closeModal="closeServiceImportingConfirmationModal"
    >
      <template #footer>
        <div class="is-flex is-justify-content-end is-align-items-center">
          <BaseButton
            action="principal"
            @click="closeServiceImportingConfirmationModal"
          >
            <p slot="text">Ok, continue</p>
          </BaseButton>
        </div>
      </template>
    </ServiceAlertsModal>

    <ServiceAlertsModal
      :selectedService="serviceEdited"
      :isModalOpen="isServiceAlertsModalOpen"
      :closeModal="closeServiceAlertsModal"
      :alertTitle="`Moving Service(S)`"
      :alertContent="serviceAlertsModalText"
    >
      <template #footer>
        <div class="is-flex is-justify-content-end is-align-items-center mt-4">
          <BaseButton
            class="m-0 mr-2"
            action="secondary"
            @click="handleServiceAlertsCancelClick"
          >
            <p slot="text">No, cancel</p>
          </BaseButton>
          <BaseButton
            action="principal"
            @click="handleServiceAlertsContinueClick"
          >
            <p slot="text">Ok, continue</p>
          </BaseButton>
        </div>
      </template>
    </ServiceAlertsModal>

    <div
      class="is-flex is-justify-content-space-between service__table__footer"
    >
      <div class="shortcutLinkContainer">
        <span>Itinerary Currency: </span>
        <strong>
          {{ itineraryCurrency.currency_name }}
        </strong>
        <div v-if="!hideElementByCondition">
          <BaseShortcutLink
            @click="handleModalShortcuts"
            class="shortcutsLink"
          />
          <BaseModal
            :isComponentModalActive="shortcutsOpen"
            type="shortcuts"
            :shortcuts="shortcuts"
            :closeModal="handleModalShortcuts"
          >
            <span slot="title">Services keyboard shortcuts </span>
          </BaseModal>
        </div>
      </div>
      <div class="is-flex gap-4" v-if="localSaving.isActive">
        <BaseButton
          size="medium"
          :disabled="disableQuoteByStatus || loading"
          action="secondary"
          @click="cancelItineraryServicesReordering"
        >
          <i slot="icon">
            <BaseButtonLock
              v-if="disableQuoteByStatus || loading"
              class="icon-check"
            />
            <IconClose v-else class="icon is-small" />
          </i>
          <p slot="text">Cancel</p>
        </BaseButton>
        <BaseButton
          v-if="localSaving.fieldUpdated === constants.SERVICE_ROW_FIELDS.ORDER"
          size="medium"
          :disabled="disableQuoteByStatus || loading"
          action="tercery"
          @click="
            () => {
              saveItineraryServiceUpdated(localSaving.payload);
              resetLocalSaving();
            }
          "
        >
          <i slot="icon">
            <BaseButtonLock
              v-if="disableQuoteByStatus || loading"
              class="icon-check"
            />
            <IconCheck v-else class="icon is-small" />
          </i>
          <p slot="text">Save changes</p>
        </BaseButton>
        <BaseButton
          v-if="
            localSaving.fieldUpdated === constants.SERVICE_ROW_FIELDS.SELECTED
          "
          size="medium"
          :disabled="disableQuoteByStatus || loading"
          action="tercery"
          @click="
            () => {
              deleteServices(localSaving.payload);
              resetLocalSaving();
            }
          "
        >
          <i slot="icon">
            <BaseButtonLock
              v-if="disableQuoteByStatus || loading"
              class="icon-check"
            />
            <IconTrash v-else class="icon is-small" />
          </i>
          <p slot="text">Delete Selected</p>
        </BaseButton>
      </div>
      <div
        v-if="!hideElementByCondition"
        class="is-relative save_button__container"
      >
        <BaseButton
          v-if="itinerary.data && itinerary.data.id && !localSaving.isActive"
          size="medium"
          @click="onAddServiceClick"
          :disabled="disableQuoteByStatus"
          :class="focusedGuideBoxClass('add__services__button', 24)"
          action="tercery"
          :data-test-id="constants.DATA_TEST_ID_VALUES.ADD_SERVICE_BUTTON"
        >
          <i slot="icon">
            <BaseButtonLock v-if="disableQuoteByStatus" class="icon-check" />
            <IconPlus v-else class="icon is-small" />
          </i>
          <p slot="text">Add Service</p>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parse, format } from "date-fns";
import BEditableTable from "bootstrap-vue-editable-table";
import cloneDeep from "lodash.clonedeep";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import AddServicesModal from "@/components/quote-views/_shared/AddServicesModal.vue";
import EditServiceSideBar from "@/components/_shared/EditServiceSideBar.vue";
import ServicesTableActions from "@/components/_shared/ServicesTableActions.vue";
import ServicesUpdateDateModals from "./ServicesUpdateDateModals.vue";
import GuideBox from "../../_shared/GuideBox.vue";
import ServiceAlertsModal from "./ServiceModals/ServiceAlertsModal.vue";
import ServiceImportModal from "./ServiceModals/ServiceImportModal.vue";
import MoveItineraryAlert from "./ServiceModals/ServiceMoveModal/MoveItineraryAlert.vue";
import ServiceMoveMassiveModal from "./ServiceModals/ServiceMoveMassiveModal.vue";
import ServiceInsertBetweenDestinationsModal from "./ServiceModals/ServiceInsertBetweenDestinationsModal.vue";
import ServiceSelectModal from "./ServiceSelectModal/ServiceSelectModal.vue";
import ServiceReplaceModal from "./ServiceModals/ServiceReplaceModal.vue";
import ServiceHistoryModal from "./ServiceModals/ServiceHistoryModal/ServiceHistoryModal.vue";
import ServiceTableFilters from "./ServiceTableFilters.vue";
import {
  addDaysToDate,
  addPropertiesToObject,
  calculateDays,
  deleteObjectProperties,
  formatNumber,
  getServiceTypeNameById,
  getSalesManualUUID,
  setItemToLocalStorage,
  setDay,
  setDatesFromDay,
  setLevel,
  showIconByServiceType,
  scrollTo,
} from "@/utils/utils";
import { cutArrayToLimit } from "@/utils/filter";
import { serviceTableShortcuts as shortcuts } from "@/utils/shortcuts";
import { pricesHelper } from "@/utils/prices";
import {
  SERVICE_TYPE,
  SERVICE_TABLE_FIELDS,
  SERVICE_TABLE_FIELDS_IDS,
  PERMISSION,
  DATE_FORMAT_YYYY_MM_DD,
  USER_ROLE,
  MAX_PROCESS_SERVICES,
} from "@/constants";
import {
  SERVICE_ROW_FIELDS,
  SERVICE_OPTIONAL_TYPES,
  SERVICE_LOCATION_TYPES,
  QUOTE_ACTION_TYPES,
  EDIT_SERVICE_SIDEBAR_TABS_IDS,
} from "@/constants/services";
import SkeletonServicesTable from "./SkeletonServicesTable.vue";
import helpers from "@/helpers";
import { helpers as adapters } from "@/utils/adapters";
import { serviceHelper } from "@/utils/service";
import ServiceRowCard from "./ServiceRowCard.vue";
import { getDateObject, datesHelper } from "@/utils/dates";
import { DATA_TEST_ID_VALUES } from "@/constants/test";
import { PATH_INFO } from "@/router/path";
import CustomDotAlert from "@/components/_shared/CustomDotAlert.vue";

export default {
  name: "ServicesTable",
  components: {
    AddServicesModal,
    EditServiceSideBar,
    ServicesTableActions,
    BEditableTable,
    ServicesUpdateDateModals,
    SkeletonServicesTable,
    GuideBox,
    ServiceAlertsModal,
    ServiceImportModal,
    ServiceMoveMassiveModal,
    ServiceInsertBetweenDestinationsModal,
    ServiceSelectModal,
    ServiceRowCard,
    ServiceTableFilters,
    ServiceReplaceModal,
    ServiceHistoryModal,
    CustomDotAlert,
    ClipLoader,
    MoveItineraryAlert,
  },
  data() {
    return {
      testerDate: [new Date(), new Date()],
      currentQuoteAction: null,
      servicesLoading: {
        isLoading: false,
        items: [],
      },
      serviceToReplace: null,
      showServiceReplaceModal: false,
      showServiceMassiveModal: false,
      showServiceInsertBetweenDestinationsModal: false,
      serviceMassiveOptions: [],
      maintainServiceManualPrices: false,
      serviceAlertsModalText: "",
      isUpdateItineraryDatesModalOpen: false,
      isServiceAlertsModalOpen: false,
      isServiceSelectModalActive: false,
      constants: {
        SERVICE_TYPE,
        SERVICE_ROW_FIELDS,
        DATA_TEST_ID_VALUES,
        DATE_FORMAT_YYYY_MM_DD,
        SERVICE_OPTIONAL_TYPES,
      },
      helpers: { ...helpers, ...serviceHelper, format, ...datesHelper },
      fullService: null,
      newService: {
        country: "",
        location: "",
        service: null,
        type: "",
        contract_user: null,
        contract: null,
        start_date: null,
        end_date: null,
        info: 1,
        id_service_type: null,
        cost: 0,
        cost_unit: 0,
        price_unit: 0,
        price: 0,
        margin: 0,
        percentage_margin: 0,
        calculate_prices: 1,
        servicesRelated: [],
      },
      isServiceImportModalOpen: false,
      isServiceHistoryModalOpen: false,
      serviceIdToDisplayHistory: null,
      initialFields: SERVICE_TABLE_FIELDS,
      modalPreventCreateService: false,
      selected: false,
      selectedService: null,
      rowSelected: null,
      shortcutsOpen: false,
      shortcuts,
      setItemToLocalStorage,
      localStorage,
      cancel: ["x", "outside"],
      showIconByServiceType,
      openModal: "",
      modalMessage: "",
      currentServiceItineraryRow: null,
      newItineraryStartDate: null,
      currentRow: null,
      rowUpdate: null,
      previousService: null,
    };
  },
  beforeDestroy() {
    const editableElement = document.querySelector(".tableServiceTable");
    editableElement?.removeEventListener(
      "keydown",
      this.handleServiceTableKeyDownEvents
    );
  },
  methods: {
    getDatesPicker(service) {
      const start_date = getDateObject(service.start_date);
      const end_date = getDateObject(service.end_date);
      return [start_date, end_date];
    },
    closeShowUpdateItineraryModal() {
      this.isUpdateItineraryDatesModalOpen = false;
    },
    disablePriceUnitField(service) {
      return (
        this.isAccommodationPackageService(service.id_service_type) ||
        !this.hasEditServicePricesPermission
      );
    },
    disablePriceField() {
      return !this.hasEditServicePricesPermission;
    },
    async handleServiceMoveMassiveContinueClick(
      setLoading = true,
      cur_step = 0,
      last_step = 0,
      maintainServiceManualPrices = false
    ) {
      await this.moveAllServices(
        setLoading,
        cur_step,
        last_step,
        maintainServiceManualPrices
      );
    },
    closeServiceImportingConfirmationModal() {
      this.$store.dispatch("itinerary/resetServiceImportingConfirmationModal");
    },
    closeServiceAlertsModal() {
      this.isServiceAlertsModalOpen = false;
    },
    openServiceAlertsModal() {
      this.isServiceAlertsModalOpen = true;
    },
    handleServiceAlertsCancelClick() {
      this.closeServiceAlertsModal();
      this.resetStateAfterServicesMovinAction();
    },
    handleServiceAlertsContinueClick() {
      if (QUOTE_ACTION_TYPES.ADDING_NEW_SERVICE === this.currentQuoteAction) {
        this.closeServiceAlertsModal();
      }
      if (
        QUOTE_ACTION_TYPES.SAVE_MULTIPLE_SERVICES === this.currentQuoteAction
      ) {
        this.handleEditMultipleRows(this.serviceEdited);
      }
      if (QUOTE_ACTION_TYPES.SAVE_SINGLE_SERVICE === this.currentQuoteAction) {
        this.handleEditMultipleRows(this.serviceEdited);
      }
      this.closeServiceAlertsModal();
    },
    getDiffDays(serviceEdited) {
      const isServiceEndDateFieldModified =
        serviceEdited.field.key === SERVICE_ROW_FIELDS.END_DATE;
      if (serviceEdited.field.key === SERVICE_ROW_FIELDS.START_DATE) {
        return datesHelper.getDatesDiffByDates(
          serviceEdited.item.start_date,
          serviceEdited.previousValue
        );
      } else if (isServiceEndDateFieldModified) {
        return datesHelper.getDatesDiffByDates(
          serviceEdited.value,
          serviceEdited.previousDatesValue.endDate
        );
      } else {
        return datesHelper.getDatesDiffByDay(
          serviceEdited.previousValue,
          serviceEdited.value
        );
      }
    },
    getServiceChunks(servicesToDivide) {
      const isServiceEndDateFieldModified =
        this.serviceEdited.field.key === SERVICE_ROW_FIELDS.END_DATE;

      const serviceRelatedOptions = servicesToDivide.flatMap(
        (service) => service.servicesRelated
      );

      const serviceUUIDs = isServiceEndDateFieldModified
        ? [...serviceRelatedOptions]
        : [
            ...this.serviceEdited.item.servicesRelated,
            ...serviceRelatedOptions,
          ];

      return {
        chunks: helpers.sliceIntoChunks(serviceUUIDs, MAX_PROCESS_SERVICES),
        serviceUUIDs,
      };
    },
    resetStateAfterServicesMovinAction() {
      this.serviceEdited = null;
      this.maintainServiceManualPrices = false;
      this.serviceMassiveOptions = [];
      this.closeServiceMassiveModal();
      this.$emit("update:updateServiceTableSkeleton", false);
      this.isServiceAlertsModalOpen = false;
      this.isUpdateItineraryDatesModalOpen = false;
      this.updateServiceTableSkeleton(false);
    },
    moveOnlyOneService(maintainServiceManualPrices = false) {
      this.handleEditMultipleRows(this.serviceEdited, {
        calculate_prices: Number(!maintainServiceManualPrices),
      });
      this.resetStateAfterServicesMovinAction();
    },
    async moveAllServices(
      setLoading = true,
      cur_step = 0,
      last_step = 0,
      maintainServiceManualPrices = false
    ) {
      const daysToMove = this.getDiffDays(this.serviceEdited);

      if (
        this.serviceEdited.field.key === SERVICE_ROW_FIELDS.START_DATE &&
        this.servicesItinerary.at(0)?.id === this.serviceEdited.item.id &&
        this.itinerary.data.start_date === this.serviceEdited.previousValue &&
        daysToMove >= 0 &&
        !this.isUpdateItineraryDatesModalOpen
      ) {
        this.isUpdateItineraryDatesModalOpen = true;
        return this.closeServiceMassiveModal();
      }
      if (setLoading) this.setLoading(true);
      this.$emit("update:updateServiceTableSkeleton", true);

      let { serviceUUIDs } = this.getServiceChunks(this.serviceMassiveOptions);

      const prevDatesRange =
        this.serviceEdited.field.key !== SERVICE_ROW_FIELDS.DAY
          ? datesHelper.getDatesDiffByDates(
              this.serviceEdited.previousDatesValue.endDate,
              this.serviceEdited.previousDatesValue.startDate
            )
          : datesHelper.getDateRangeByDay(this.serviceEdited.value);

      const currentDatesRange =
        this.serviceEdited.item.end_date >= this.serviceEdited.item.start_date
          ? datesHelper.getDatesDiffByDates(
              this.serviceEdited.item.end_date,
              this.serviceEdited.item.start_date
            )
          : 0;

      const datesRangeHasChanged = prevDatesRange !== currentDatesRange;

      const servicesToMoveIds = !datesRangeHasChanged
        ? serviceUUIDs
        : serviceUUIDs.filter(
            (service) => this.serviceEdited.item.id !== service.id
          );

      const chunks = helpers.sliceIntoChunks(
        servicesToMoveIds,
        MAX_PROCESS_SERVICES
      );

      const defaultSteps = (datesRangeHasChanged ? 1 : 0) + chunks.length + 1;

      let step = cur_step > 0 ? cur_step : 1;

      const TOTAL_STEPS_TO_PERFORM = last_step > 0 ? last_step : defaultSteps;

      if (datesRangeHasChanged)
        await this.handleEditMultipleRows(this.serviceEdited, {
          calculate_prices: Number(!maintainServiceManualPrices),
          cur_step: step++,
          last_step: TOTAL_STEPS_TO_PERFORM,
        });

      await this.$store.dispatch("itinerary/moveServices", {
        itinerary: this.$route.query.itinerary,
        services: servicesToMoveIds,
        daysToMove: daysToMove,
        calculate_prices: Number(!maintainServiceManualPrices),
        cur_step: step,
        last_step: TOTAL_STEPS_TO_PERFORM,
        reverting: daysToMove >= 0,
      });

      this.handleChangeTimerCount(30);
      this.resetStateAfterServicesMovinAction();
      if (setLoading) this.setLoading(false);
    },
    async importService(itineraryService = null) {
      this.updateServicesLoading(
        itineraryService,
        true,
        "Updating service ...",
        false
      );

      this.$store.dispatch("itinerary/updateEntitiesImportingList", {
        importing: [itineraryService.id],
      });

      const response = await this.$store.dispatch("itinerary/importService", {
        serviceId: itineraryService.id,
        itineraryId: this.itinerary.data.id,
      });

      this.$buefy.toast.open({
        message: response.message,
        type: "is-success",
        duration: 5000,
      });
    },
    closeServiceImportModal() {
      this.isServiceImportModalOpen = false;
    },
    openServiceImportModal() {
      this.isServiceImportModalOpen = true;
    },
    validateServiceLocationBeforeAdding(serviceToAdd = {}) {
      const { isDifferentLocation, nextServices } =
        serviceHelper.validateServiceLocationsWhenInserting(
          this.services_itinerary,
          this.itineraryDays,
          serviceToAdd
        );

      if (
        !isDifferentLocation ||
        this.showServiceInsertBetweenDestinationsModal
      ) {
        return false;
      }

      const previousServiceIndex =
        this.servicesItinerary.length - nextServices.length - 2;
      this.previousService = this.servicesItinerary[previousServiceIndex];

      this.serviceMassiveOptions = nextServices;
      this.serviceEdited = {
        ...serviceToAdd,
        day: datesHelper.getDayPosition(
          [this.itinerary.data.start_date, this.itinerary.data.end_date],
          [serviceToAdd.start_date, serviceToAdd.end_date]
        ),
        visible: true,
      };

      this.openServiceInsertBetweenDestinationsModal(true);

      return true;
    },
    clearServiceInsertBetweenDestinationsModalData() {
      this.previousService = null;
      this.serviceMassiveOptions = [];
      this.resetServiceEdited();
    },
    async setNewService(serviceToSave, params = {}) {
      this.setLoading(true);

      const stopServiceSaving = this.validateServiceLocationBeforeAdding({
        start_date: this.currentRow.start_date,
        end_date: this.currentRow.end_date,
        ...serviceToSave,
      });

      if (stopServiceSaving) {
        this.setLoading(false);
        this.closeServiceSelectModal();
        return;
      }

      const adaptedLocation = serviceToSave.location?.find(
        (location) => location.parent !== SERVICE_LOCATION_TYPES.COUNTRY
      );
      this.newService.service = serviceToSave.id;
      this.newService.code = serviceToSave.code;
      this.newService.location = adaptedLocation?.location_code || "";
      this.setFullServiceWithPrices(serviceToSave);

      const parentService = await this.$store.dispatch("services/getService", {
        id: serviceToSave.id,
        itinerary: this.$route.query.itinerary,
        calculate_prices: params.calculate_prices || 0,
        info: 1,
        from: this.itinerary.data.start_date,
        to: this.itinerary.data.end_date,
        num_pax: this.itinerary.data.num_pax,
      });

      await this.$store.dispatch("services/resetService");

      const adaptedServiceToAdd = adapters.adaptServiceToAdd(
        {
          ...this.currentRow,
          ...serviceToSave,
        },
        parentService
      );

      await this.createItineraryService(adaptedServiceToAdd, params);
      this.closeServiceSelectModal();
    },
    isFreeService(service) {
      return parseFloat(service.price) === 0;
    },
    alertType(service) {
      const hasNoServiceSupplier = service.service_supplier?.length === 0;
      const hasNoSalesManualPrice =
        service.service_price?.[0]?.sales_manual_id?.length === 0;

      return this.isFreeService(service) ||
        hasNoServiceSupplier ||
        hasNoSalesManualPrice
        ? "danger"
        : "warning";
    },
    alertActivated(service) {
      const hasNoServiceSupplier = service.service_supplier?.length === 0;

      const servicePriceHasRisk = service.service_price?.some(
        (price) => price.risk_amount > 0
      );

      return (
        this.isFreeService(service) ||
        service.isPriceEdited ||
        hasNoServiceSupplier ||
        servicePriceHasRisk
      );
    },
    alertTooltip(service) {
      const hasNoServiceSupplier = service.service_supplier?.length === 0;
      const hasNoSalesManualPrice =
        service.service_price?.[0]?.sales_manual_id?.length === 0;

      const servicePriceHasRisk = service.service_price?.some(
        (price) => price.risk_amount > 0
      );

      if (hasNoServiceSupplier || hasNoSalesManualPrice)
        return "There are not prices found. Enter into the details to know more.";

      if (this.isFreeService(service))
        return "There are not prices found. Enter into the details to know more.";

      if (service.cost > 1 && service.cost > service.price)
        return "The price is lower than the cost.";

      if (service.isPriceEdited) return "The price was modified.";

      if (servicePriceHasRisk && !service.isPriceEdited)
        return "The price has a risk amount. Enter into the details to know more.";

      return "";
    },
    onSelectedChange(data) {
      this.servicesItinerary[data.index].selected =
        !this.servicesItinerary[data.index].selected;

      const servicesSelected = this.servicesItinerary.filter(
        (service) => service.selected
      );

      this.udpateLocalSaving({
        isActive: true,
        fieldUpdated: SERVICE_ROW_FIELDS.SELECTED,
        payload: servicesSelected,
      });
    },
    async setIsServiceHistoryModalOpen(value = false) {
      this.isServiceHistoryModalOpen = value;
    },
    async displayServiceHistoryModal(serviceId) {
      await this.validateFunctionExecution(async () => {
        this.setIsServiceHistoryModalOpen(true);
        this.serviceIdToDisplayHistory = serviceId;
        await this.getServiceHistory({ serviceId });
      });
    },
    async getServiceHistory(payload = null) {
      this.setLoading(true);
      await this.$store.dispatch("itinerary/getServiceHistory", payload);
      this.setLoading(false);
    },
    handleServiceTableKeyDownEvents(event) {
      const code = event?.which || event?.keyCode;
      if (code === 13) this.stopPropagation(event);
    },
    setDateFormat(date) {
      return format(date, DATE_FORMAT_YYYY_MM_DD);
    },
    loadServiceInformationFromLocalStorage() {
      const itineraryUUID = this.$route.query.itinerary;
      if (itineraryUUID) {
        const localStorageData = JSON.parse(
          localStorage.getItem(`${itineraryUUID}`)
        );
        this.updateSearchServicesPayload("", "", {
          from:
            localStorageData && localStorageData.from
              ? localStorageData.from
              : this.itinerary.data && this.itinerary.data.start_date
              ? this.itinerary.data.start_date
              : "",
          to:
            localStorageData && localStorageData.to
              ? localStorageData.to
              : this.itinerary.data && this.itinerary.data.end_date
              ? this.itinerary.data.end_date
              : "",
          level:
            localStorageData && localStorageData.level
              ? localStorageData.level
              : 0,
          level_text:
            localStorageData && localStorageData.level_text
              ? localStorageData.level_text
              : "All",
        });
        if (this.newService) {
          const itineraryServices = this.services_itinerary.filter(
            (service) => !serviceHelper.isDraftService(service)
          );

          let country = localStorageData?.country || "";
          let location = localStorageData?.location || "";
          if (itineraryServices.length > 0) {
            const lastItineraryService =
              itineraryServices[itineraryServices.length - 1];
            if (country.length === 0) {
              country = this.getLocationCountry(
                lastItineraryService.location[0],
                "location_name"
              );
            }
            if (location.length === 0) {
              location = lastItineraryService.location.find(
                (location) => location.parent > 0
              )?.location_code;
            }
          } else if (country.length === 0) {
            country = this.contractCountries?.[0].location_name;
          }

          this.updateNewServiceItineraryForm([
            [
              "level",
              localStorageData && localStorageData.level
                ? localStorageData.level
                : 0,
            ],
            [
              "level_text",
              localStorageData && localStorageData.level_text
                ? localStorageData.level_text
                : "All",
            ],
            ["country", country],
            ["location", location],
          ]);
        }
      }
    },
    setNewServiceData() {
      if (this.$route.query.itinerary) {
        this.loadServiceInformationFromLocalStorage();
        this.getDestinationsPerCountry(this.newService.country);
      }
    },
    resetItems(items = []) {
      return items.map((item) => {
        let newItem = {
          ...item,
          id: null,
        };
        deleteObjectProperties(newItem, [
          "entity_id",
          "entity_parent_id",
          "entity_type_id",
          "entity_uuid",
        ]);
        return newItem;
      });
    },
    getNewServiceForm(baseService = null) {
      if (baseService) {
        const locations = baseService.location;
        const countryId = locations?.[0]?.parent || locations?.[0]?.id;

        const country =
          baseService?.country?.length > 0
            ? baseService.country
            : this.contractCountries.find((country) => country.id === countryId)
                ?.location_name || "";

        const destination = Array.isArray(baseService.location)
          ? baseService?.location?.find((location) => location.parent > 0)
          : this.newService.location;

        const servicePrice = this.resetItems(baseService.service_price);
        const serviceSupplier = this.resetItems(baseService.service_supplier);

        const day = baseService?.day || this.newService.day;

        const start_date =
          baseService?.start_date || this.newService.start_date;

        const end_date = baseService?.end_date || this.newService.end_date;

        const level = baseService?.level || this.newService.level;

        const num_pax = baseService?.num_pax || this.newService.num_pax;

        const images = Array.isArray(
          baseService?.images || this.newService.images
        )
          ? baseService?.images?.map((imageId) => ({ id: imageId }))
          : adapters.imagesStringToArray(baseService?.images);

        const description =
          baseService?.description || this.newService.description;

        const name = baseService?.name || this.newService.name;

        this.newService = {
          ...baseService,
          images,
          description,
          name,
          service_price: servicePrice,
          service_supplier: serviceSupplier,
          id: null,
          country,
          location: destination || {},
          calculate_prices: 0,
          day,
          start_date,
          end_date,
          level,
          num_pax,
        };
        this.setFullServiceWithPrices({
          ...this.newService,
          id: baseService.service,
        });
        return this.newService;
      }

      const lastItineraryServiceEndDate =
        this.services_itinerary?.at(-1)?.end_date;

      const newServiceFormStartDate = lastItineraryServiceEndDate
        ? new Date(lastItineraryServiceEndDate + " 00:00:00")
        : new Date(this.itinerary.data.start_date + " 00:00:00");

      const accommodationEndDate = parse(
        new Date(newServiceFormStartDate).setDate(
          newServiceFormStartDate.getDate() + 1
        )
      );

      const start_date = this.setDateFormat(newServiceFormStartDate);
      const end_date =
        this.newService.id_service_type === SERVICE_TYPE.ACCOMMODATION
          ? this.setDateFormat(accommodationEndDate)
          : this.setDateFormat(newServiceFormStartDate);

      return {
        code: "",
        description: {},
        end_date,
        id: null,
        images: "{}",
        level: this.newService.level,
        level_text: this.newService.level_text,
        name: {
          value: null,
        },
        num_pax: this.numPax,
        order: "",
        passengers: "{[]}",
        recommendations: {},
        service: null,
        service_price: [],
        service_supplier: [],
        servicesRelated: [],
        start_date,
        status: 1,
        cost: 0,
        price: 0,
        margin: 0,
        percentage_margin: 0,
        visible: true,
        day: setDay(start_date, end_date, this.itinerary.data),
        calculate_prices: 1,
      };
    },
    addServiceByCode(baseService = null) {
      const lastIndex = this.services_itinerary.length - 1;
      if (
        this.services_itinerary &&
        this.services_itinerary.length &&
        serviceHelper.isDraftService(this.services_itinerary[lastIndex])
      ) {
        this.removeItem(lastIndex);
      }
      const servicesItineraryUpdated = this.services_itinerary;
      const newServiceForm = this.getNewServiceForm(baseService);

      this.dispatchServicesItinerary([
        ...servicesItineraryUpdated,
        newServiceForm,
      ]);
      this.checkScrollServiceList();
    },
    checkScrollServiceList() {
      this.$nextTick(() => {
        const lastIndex = this.services_itinerary.length - 1;
        const servicesRows = document.querySelectorAll("tbody tr");
        scrollTo(servicesRows, lastIndex);
        this.handleValidateIsEditing(true);
      });
    },
    preventCreateNewService(baseService = null) {
      if (this.disableQuoteByStatus) return;
      if (this.hideElementByCondition) return;

      if (this.$route.query.itinerary) {
        this.$store.dispatch("services/resetServices", false);
        localStorage.removeItem("newService");
        if (this.newService.id_service_type) {
          localStorage.setItem("newService", JSON.stringify(this.newService));
          this.handleModalPreventCreateService();
        } else {
          this.setNewServiceData();
          this.addServiceByCode(baseService);
        }
      } else {
        this.$router.push(PATH_INFO.HOME.path);
      }
    },
    updateServiceTableSkeleton(value = false) {
      this.$emit("update:updateServiceTableSkeleton", value);
    },
    highlightRow(service = {}, serviceRowRef = "") {
      const isServiceLoading = this.servicesLoading.items.some(
        (loadingService) => loadingService.id === service.id
      );
      if (isServiceLoading) return "recentlyAffected is__loading";
      const servicesIds =
        service.servicesRelated?.map((serviceRelated) => serviceRelated.id) ||
        [];
      const serviceAffected = this.itineraryServicesAffected?.find(
        (serviceAffected) => servicesIds.includes(serviceAffected.entity)
      );
      if (service?.id && service?.price < 1) {
        this.$refs[
          serviceRowRef
        ]?.parentElement.parentElement.parentElement.classList.add("danger");
      } else {
        this.$refs[
          serviceRowRef
        ]?.parentElement.parentElement.parentElement.classList.remove("danger");
      }
      if (serviceAffected === undefined) return "";
      return serviceAffected?.processed
        ? "recentlyAffected processed"
        : "recentlyAffected not_processed";
    },
    setNewServiceLocationByCountry(newCountry) {
      this.newService.location =
        this.newService.country === newCountry ? this.newService.location : "";
      this.newService.country = newCountry;
    },
    resetServicesResults() {
      this.$store.dispatch("services/setServices", []);
    },
    handleClickServiceRowCard(
      currentItem,
      serviceSidebarTab = null,
      focusedElement = ""
    ) {
      const isAdding = currentItem.id == null;
      if (isAdding) {
        this.openServiceSelectModal(currentItem);
      } else {
        this.serviceEdited = currentItem;
        this.handleModalEditServiceModal(
          currentItem,
          serviceSidebarTab,
          focusedElement
        );
      }
    },
    getLocationCountry(location, key) {
      if (location.parent > 0) {
        return this.getParentLocation(location.parent, key);
      }
      return location[key];
    },
    openDatepickerByRef(ref) {
      this.$refs[ref].toggle();
    },
    resetServiceEdited() {
      if (!(this.serviceMassiveOptions.length > 0)) {
        this.serviceEdited = null;
        return;
      }
      if (this.serviceEdited.field.key !== SERVICE_ROW_FIELDS.DAY) {
        this.serviceEdited.item.start_date =
          this.serviceEdited.previousDatesValue.startDate;
        this.serviceEdited.item.end_date =
          this.serviceEdited.previousDatesValue.endDate;
        this.serviceEdited.item.dates =
          this.serviceEdited.previousDatesValue.dates;
      } else {
        this.serviceEdited.item.day = this.serviceEdited.previousValue;
      }

      this.updateServicesItinerary({
        serviceItineraryIndex: this.serviceEdited.index,
        dataUpdated: this.serviceEdited.item,
      });

      this.serviceEdited = null;
    },
    saveSelectedDates(data, value) {
      const isRange = value?.length === 2;
      const prevStartDateValue = data.item.start_date;
      const newStartDateValue = isRange ? value[0] : value;
      const isStartDateChanged =
        prevStartDateValue !==
        format(newStartDateValue, DATE_FORMAT_YYYY_MM_DD);

      data.previousDatesValue = {
        startDate: data.item.start_date,
        endDate: data.item.end_date,
        day: data.item.day,
        dates: data.item.dates?.length
          ? [
              getDateObject(data.item.start_date),
              getDateObject(data.item.start_date),
            ]
          : getDateObject(data.item.start_date),
      };
      data.item.start_date = isRange
        ? format(value[0], DATE_FORMAT_YYYY_MM_DD)
        : format(value, DATE_FORMAT_YYYY_MM_DD);
      data.item.end_date = isRange
        ? format(value[1], DATE_FORMAT_YYYY_MM_DD)
        : format(data.item.end_date, DATE_FORMAT_YYYY_MM_DD);
      const newData = {
        ...data,
        field: { key: isStartDateChanged ? "start_date" : "end_date" },
        value: isStartDateChanged ? data.item.start_date : data.item.end_date,
        previousValue: prevStartDateValue || "",
      };

      this.handleEditMultipleRows(newData);
    },
    updateFields(fields = []) {
      this.initialFields = fields;
    },
    updateFilteredItineraryServices(services = []) {
      this.servicesItinerary = services;
    },
    validatePaxInput(e, isGrouped) {
      if (isGrouped) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    validateClickOnCell(condition, event, callback = null) {
      if (condition) {
        event.stopPropagation();
        event.preventDefault();
      } else if (callback !== null) {
        callback();
      }
    },
    stopPropagation(e) {
      e.stopPropagation();
    },
    closeServiceSelectModal() {
      this.isServiceSelectModalActive = false;
    },
    openServiceSelectModal(currentRow = false) {
      this.isServiceSelectModalActive = true;
      this.currentRow = currentRow;
    },
    openServiceReplaceModal(service = null) {
      this.serviceToReplace = service;
      this.showServiceReplaceModal = true;
    },
    closeServiceReplaceModal() {
      this.serviceToReplace = null;
      this.showServiceReplaceModal = false;
    },
    isAccommodationPackageService(id_service_type) {
      return (
        id_service_type === SERVICE_TYPE.ACCOMMODATION ||
        id_service_type === SERVICE_TYPE.PACKAGE
      );
    },
    getDestinations(service) {
      return service.location.filter((location) => location.parent > 0);
    },
    getServiceCostCurrency(data) {
      if (
        [SERVICE_TYPE.ACCOMMODATION, SERVICE_TYPE.PACKAGE].includes(
          data.item.id_service_type
        ) &&
        data.item.service_supplier?.length
      )
        return data.item.service_supplier[0].currency_sign;
      if (data.item.service_supplier === undefined)
        return this.itinerary.data.currency.currency_sign;
      if (data.item.service_supplier === null)
        return this.itinerary.data.currency.currency_sign;
      const currency_id = data?.item?.service_supplier[0]?.currency_id;
      if (currency_id === 0 || currency_id === null)
        return this.itinerary.data.currency.currency_sign;
      const currency_sign = this.currencies.find(
        (currency) => currency.id === currency_id
      )?.currency_sign;
      return currency_sign;
    },
    async createItineraryService(newService, params = {}) {
      let newServiceUpdated = newService;
      const id = newService.service;
      if (!id || !newService.start_date || !newService.id_service_type) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "Please search and select a service.",
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }

      if (
        serviceHelper.isAccommodationPackageService(
          newService.id_service_type
        ) &&
        newService.start_date === newService.end_date
      ) {
        newServiceUpdated.end_date = addDaysToDate(newService.start_date);
      }

      const newOrder = this.services_itinerary
        .filter((s) => s.id !== null)
        .reduce((maxOrder, service) => {
          const orders = service.servicesRelated.map((s) => s.order);
          const max = Math.max(...orders);
          return Math.max(max, maxOrder);
        }, 0);

      newServiceUpdated.order = newOrder + 1;
      if (this.service.id === id) {
        newServiceUpdated = addPropertiesToObject(this.service, newService);
        newServiceUpdated.prices_costs_margins =
          this.service.prices_costs_margins;
      }
      if (this.service?.prices_costs_margins) {
        const priceFromService = this.service.prices_costs_margins.price ?? 0;
        newServiceUpdated.calculate_prices =
          Number(priceFromService) === Number(newService.price) ? 1 : 0;
      } else {
        newServiceUpdated.calculate_prices =
          newService.service_price?.length > 0 ? 0 : 1;
        newServiceUpdated.prices_costs_margins = {
          service_supplier: newService.service_supplier ?? [],
        };
      }
      this.rowUpdate = {
        id: null,
        action: "update",
      };
      const response = await this.createItineraryServiceForm(
        {
          ...newServiceUpdated,
          id,
        },
        params
      );
      if (response) {
        this.resetNewService();
      }
    },
    calculatePriceItineraryService(data, type) {
      const cost = Number(data.cost) ?? 0;
      const margin = Number(data.margin) ?? 0;
      const percentage_margin = Number(data.percentage_margin) ?? 0;
      const price = Number(data.price) ?? 0;
      const price_unit = Number(data.price_unit) ?? 0;
      const days = calculateDays(data.start_date, data.end_date) - 1;

      let newPrice = price;
      let newMargin = margin;
      let newPercentageMargin = percentage_margin;
      let newPriceUnit = price_unit;
      let newServicePrice = data.service_price ?? [];

      if (type == "percentage_margin") {
        newPrice = (cost * (1 + percentage_margin / 100)).toFixed(2);
        newMargin = (cost * (percentage_margin / 100)).toFixed(2);
        newPriceUnit = isFinite(Number(newPrice) / Number(days))
          ? (Number(newPrice) / Number(days)).toFixed(2)
          : newPrice;
      } else if (type == "price") {
        const calculate = ((price / cost - 1) * 100).toFixed(2);
        newMargin = (price - cost).toFixed(2);
        newPercentageMargin = isFinite(calculate)
          ? parseFloat(calculate).toFixed(2)
          : 0;
        newPriceUnit = isFinite(Number(price) / Number(days))
          ? (Number(price) / Number(days)).toFixed(2)
          : price.toFixed(2);

        newServicePrice = serviceHelper.calculateServicePrice(data, newPrice);
      } else if (type == "margin") {
        newPrice = (cost + margin).toFixed(2);
        const calculate = ((margin / cost) * 100).toFixed(2);
        newPercentageMargin = isFinite(calculate)
          ? parseFloat(calculate).toFixed(2)
          : 0;
        newPriceUnit = isFinite(Number(newPrice) / Number(days))
          ? (Number(newPrice) / Number(days)).toFixed(2)
          : newPrice;
      }
      return {
        newPrice,
        newPriceUnit,
        newMargin,
        newPercentageMargin,
        newServicePrice,
      };
    },
    destinationText(item) {
      return `${item.location_name} (${item.location_code})`;
    },
    setFullServiceWithPrices(service) {
      this.fullService = service;
    },
    async getFullServiceWithPrices(uuid, data) {
      try {
        const dataUpdated = data;
        this.setLoading(true);
        const service = this.fullService;
        if (service) {
          if (this.itinerary.data) {
            const { id_service_type, location, name, code } = service;
            dataUpdated.name.value = name ? name.value : "";
            this.newService.calculate_prices = 1;
            // complete country, location and id_service_type fields
            this.newService.id_service_type = dataUpdated.id_service_type =
              id_service_type;
            this.newService.country = dataUpdated.country = this.newService
              .country
              ? this.newService.country
              : this.searchServicesPayload.country;
            this.newService.location = dataUpdated.location = this.newService
              .location
              ? this.newService.location
              : location && location.length
              ? location[0].location_code
              : this.searchServicesPayload.location;

            // Update end_date according to id_service_type
            const newEndDate = this.setEndDateToNewServiceByIdServiceType(
              id_service_type,
              dataUpdated
            );
            this.newService.start_date = dataUpdated.start_date;
            this.newService.end_date = dataUpdated.end_date = newEndDate;
            this.resetNewServiceCostPriceAndMargins(dataUpdated);
            const responseData = await this.handleSearchService({
              from: this.newService.start_date,
              to: this.newService.end_date,
              id: this.fullService.id,
              num_pax: dataUpdated.num_pax,
            });
            const { prices_costs_margins, room } = responseData;
            const country = responseData.location.find(
              (item) => item.parent === 0
            );
            const destination = responseData.location.find(
              (item) => item.parent !== 0
            );
            const isCountryAvailableToAdd = country !== undefined;
            const isDestinationAvailableToAdd = destination !== undefined;
            this.newService.country = isCountryAvailableToAdd
              ? country.location_name
              : this.newService.country;
            this.getDestinationsPerCountry(this.newService.country);
            this.newService.location = isDestinationAvailableToAdd
              ? destination
              : this.newService.location;
            if (serviceHelper.isPackageService(id_service_type)) {
              this.newService.end_date = dataUpdated.end_date =
                prices_costs_margins.end_date;
            }
            //set day when select service without service type
            dataUpdated.day = this.newService.day = setDay(
              dataUpdated.start_date,
              dataUpdated.end_date,
              this.itinerary.data
            );
            dataUpdated.num_pax = prices_costs_margins.num_pax;

            this.newService.service_price = dataUpdated.service_price =
              prices_costs_margins.service_price;
            this.newService.service_supplier = dataUpdated.service_supplier =
              prices_costs_margins.service_supplier;
            this.newService.cost = dataUpdated.cost =
              prices_costs_margins.cost ?? 0;
            this.newService.price = dataUpdated.price =
              prices_costs_margins.price ?? 0;
            this.newService.margin = dataUpdated.margin =
              prices_costs_margins.margin ?? 0;
            this.newService.percentage_margin = dataUpdated.percentage_margin =
              prices_costs_margins.percentage_margin ?? 0;
            this.newService.cost_unit = dataUpdated.cost_unit =
              prices_costs_margins.cost_unit ?? 0;
            this.newService.price_unit = dataUpdated.price_unit =
              prices_costs_margins.price_unit ?? 0;
            if (
              (id_service_type !== 2 &&
                id_service_type !== 9 &&
                prices_costs_margins.price === null) ||
              ((id_service_type === 2 || id_service_type === 9) &&
                room === null)
            ) {
              this.$buefy.toast.open({
                duration: 10000,
                message:
                  id_service_type === 2 || id_service_type === 9
                    ? `There are no rooms avaliable in the ${getServiceTypeNameById(
                        id_service_type
                      )} with code: ${code}`
                    : `There is no price avaliable on the ${getServiceTypeNameById(
                        id_service_type
                      )} with code: ${code}`,
                position: "is-bottom",
                type: "is-warning",
              });
            }
            this.setLoading(false);
            this.updateServicesItinerary({
              serviceItineraryIndex: this.servicesItinerary.length - 1,
              dataUpdated,
            });
            return this.newService;
          }
        }
        throw new Error("Ups! something went wrong, please try again!");
      } catch (err) {
        this.setLoading(false);
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong, please try again!",
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    updateServicesItinerary({ serviceItineraryIndex, dataUpdated }) {
      this.$set(this.servicesItinerary, serviceItineraryIndex, dataUpdated);
      this.dispatchServicesItinerary(this.servicesItinerary);
    },
    handleModalShortcuts() {
      this.shortcutsOpen = !this.shortcutsOpen;
    },
    async handleSearchServices(searchText, data, type) {
      if (searchText.length < 7 && type === 1) return false;

      const { id_service_type, country, location } = this.newService;
      if (!country) {
        this.$buefy.toast.open({
          duration: 2000,
          message: "Please, select a country to continue.",
          position: "is-top",
          type: "is-info",
        });
        return false;
      }
      const dataUpdated = { ...data };
      this.newService.start_date = data.start_date;
      if (id_service_type) {
        const newEndDate = this.setEndDateToNewServiceByIdServiceType(
          id_service_type,
          dataUpdated
        );
        dataUpdated.end_date = newEndDate;
        this.newService.day = data.day = setDay(
          dataUpdated.start_date,
          dataUpdated.end_date,
          this.itinerary.data
        );
      }
      this.resetNewServiceCostPriceAndMargins(dataUpdated);
      this.newService.end_date = dataUpdated.end_date;
      this.newService.contract_user = this.itinerary.data.client.id;
      this.newService.contract = this.itinerary.data.contract_id;
      this.newService.code = type === 1 ? searchText : "";
      dataUpdated.name.value = "";

      this.updateSearchServicesPayload("", "", {
        from: dataUpdated.start_date,
        to: dataUpdated.end_date,
        contract_user: this.itinerary.data.client.id,
        contract: this.itinerary.data.contract_id,
        code: type === 1 ? searchText : "",
        id_service_type,
        location: location,
        country,
      });
      await this.handleSearchServicesContract();
      if (this.servicesWithText.length > 0) {
        this.openServiceSelectModal(data);
      } else {
        this.$buefy.toast.open({
          duration: 2000,
          message: "No services found",
          position: "is-top",
          type: "is-warning",
        });
      }
    },
    handleModalPreventCreateService() {
      this.newService = JSON.parse(localStorage.getItem("newService"));
      this.modalPreventCreateService = !this.modalPreventCreateService;
    },
    formatRemainderServicePrice(service, key, value) {
      const service_price = service.service_price;
      if (service_price === null) return null;
      const days = calculateDays(service.start_date, service.end_date);
      const newServicePrice = service_price.map((ser, ind) => {
        if (ind !== 0) return ser;
        const factor = ser.room_qty * days;
        return {
          ...ser,
          price_unit: Number(
            key === SERVICE_ROW_FIELDS.PRICE_UNIT ? value : ser.price_unit
          ),
          price: Number(
            key === SERVICE_ROW_FIELDS.PRICE ? value : value * factor
          ),
        };
      });
      return newServicePrice;
    },
    adapterUpdatedData(updatedData, item, key, value) {
      if (
        !this.isAccommodationPackageService(item.id_service_type) &&
        (key === SERVICE_ROW_FIELDS.PRICE_UNIT ||
          key === SERVICE_ROW_FIELDS.PRICE)
      ) {
        const newServicePrice = this.formatRemainderServicePrice(
          updatedData,
          key,
          value
        );
        const formattedUpdatedData = {
          ...updatedData,
          service_price: newServicePrice,
          price: Number(
            key === SERVICE_ROW_FIELDS.PRICE_UNIT && newServicePrice.length
              ? newServicePrice[0].price
              : updatedData.price
          ),
          price_unit: Number(
            key === SERVICE_ROW_FIELDS.PRICE && newServicePrice.length
              ? newServicePrice[0].price_unit
              : updatedData.price_unit
          ),
        };
        return formattedUpdatedData;
      }
      return updatedData;
    },
    updateServicesLoading(
      service,
      isNewLoadingService = true,
      message = "Saving changes ...",
      lockRestItineraryServices = true
    ) {
      const currentServicesLoading = this.servicesLoading.items;
      const newServicesLoading = isNewLoadingService
        ? [...currentServicesLoading, { id: service.id, message }]
        : currentServicesLoading.filter(
            (loadingService) => loadingService.id !== service.id
          );

      this.servicesLoading = {
        isLoading: newServicesLoading.length > 0 && lockRestItineraryServices,
        items: newServicesLoading,
      };
    },
    async handleEditMultipleRows(data, params = {}) {
      const isServiceLoading = this.servicesLoading.items.some(
        (item) => item.id === data.item.id
      );

      if (isServiceLoading) return;

      this.updateServicesLoading(data.item, true);

      this.serviceEdited = data;

      const isPriceField = data.field.key === SERVICE_ROW_FIELDS.PRICE;
      const servicesRelated =
        data.item.id === null ? [data.item] : data.item.servicesRelated;

      const priceToUpdate = isPriceField
        ? serviceHelper.getGroupedServicePriceToUpdate(
            data.value,
            data.item.price,
            servicesRelated?.length
          )
        : 0;

      const services = servicesRelated?.map((service, index) => {
        return {
          ...data,
          item: {
            ...service,
            start_date: data.item.start_date,
            end_date: data.item.end_date,
            dates: this.getDatesPicker(data.item),
            optional: data.item.optional,
            isGrouped: servicesRelated?.length > 1 && index !== 0,
          },
          value: isPriceField ? service.price + priceToUpdate : data.value,
        };
      });

      const stopSaving = this.validateIfDisplayAlerts(data.field.key, data);
      const isDraftService = serviceHelper.isDraftService(data?.item);

      this.currentQuoteAction = stopSaving
        ? QUOTE_ACTION_TYPES.SAVE_MULTIPLE_SERVICES
        : isDraftService
        ? QUOTE_ACTION_TYPES.ADDING_NEW_SERVICE
        : QUOTE_ACTION_TYPES.SAVE_SINGLE_SERVICE;

      if (!stopSaving) {
        const response = await Promise.allSettled(
          services?.map(async (service) => await this.handleEditRow(service))
        );
        const servicesToSave = response
          .filter((res) => res.status === "fulfilled")
          .map((res) => res.value)
          .filter((service) => service !== undefined && service !== null);

        if (servicesToSave.length) {
          const { calculate_prices, cur_step = 1, last_step = 1 } = params;

          await this.sendItineraryServiceUpdatedToAPI(
            servicesToSave.map((service) => service.service),
            {
              calculate_room_distribution:
                servicesToSave[0]?.calculate_room_distribution,
              calculate_prices,
            },
            servicesToSave[0]?.fieldUpdated,
            cur_step,
            last_step
          );
        }
        this.resetStateAfterServicesMovinAction();
      }

      this.updateServicesLoading(data.item, false);
    },
    async handleEditRow(data) {
      try {
        const key = data.field.key;
        const validations = await this.serviceItineraryValidations(key, data);
        if (!validations) {
          return;
        }

        // se actualiza data.item y su respectivo key, con el nuevo valor ingresado, dónde key es el nombre del campo editado
        data.item[key] = data.value;

        if (!data.item.id) {
          // Lógica sólo para cuando se está creando un Service Itinerary por primera vez, "Add service"
          const updatedData = await this.updateNewItineraryServiceRow(
            key,
            data
          );
          if (updatedData) {
            this.updateServicesItinerary({
              serviceItineraryIndex: data.index,
              dataUpdated: updatedData,
            });
            this.currentRow = updatedData;
          }
          return;
        } else {
          // Lógica cuando se edita o actualiza un Service Itinerary ya existente
          const updatedData =
            await this.updateItineraryServiceCommonFieldsInRow(
              key,
              data,
              data.item.id_service_type
            );

          const calculate_room_distribution =
            key === "num_pax" &&
            (data.item.id_service_type === 2 || data.item.id_service_type === 9)
              ? 1
              : 0;
          const adaptedUpdatedData = this.adapterUpdatedData(
            updatedData,
            data.item,
            key,
            data.value
          );

          return {
            service: adaptedUpdatedData,
            calculate_room_distribution,
            fieldUpdated: key,
          };
        }
      } catch (err) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong, please try again.",
          position: "is-top",
          type: "is-danger",
        });
        console.info(err);
        throw err;
      }
    },
    handleOpenModal(value) {
      this.openModal = value;
    },
    onRowSelected(evt) {
      this.selected = !this.selected;
      this.rowSelected = evt;
    },
    removeItem(index) {
      const newServices = cutArrayToLimit(this.servicesItinerary, index);
      this.resetNewService();
      this.handleRemoveService();
      this.handleValidateIsEditing(false);
      this.handleChangeTimerCount(0);
      this.dispatchServicesItinerary(newServices);
    },
    resetNewService() {
      const countryFromLG =
        JSON.parse(localStorage.getItem(`${this.$route.query.itinerary}`))
          ?.country || "";
      const locationFromLG =
        JSON.parse(localStorage.getItem(`${this.$route.query.itinerary}`))
          ?.location || "";
      this.newService = {
        country: countryFromLG,
        location: locationFromLG,
        service: null,
        type: "",
        contract_user: null,
        contract: null,
        start_date: null,
        end_date: null,
        info: 1,
        id_service_type: null,
        cost: 0,
        cost_unit: 0,
        price_unit: 0,
        price: 0,
        margin: 0,
        percentage_margin: 0,
        calculate_prices: 1,
      };

      this.currentRow = null;
    },
    resetNewServiceCostPriceAndMargins(data) {
      this.newService.cost = data.cost = 0;
      this.newService.price = data.price = 0;
      this.newService.margin = data.margin = 0;
      this.newService.percentage_margin = data.percentage_margin = 0;
      this.newService.cost_unit = data.cost_unit = 0;
      this.newService.price_unit = data.price_unit = 0;
    },
    setEndDateToNewServiceByIdServiceType(serviceType, service, nights = 0) {
      const { start_date, end_date, day } = service;
      const hasDateRange = this.hasDateRange(service);
      let newEndDate = end_date;
      if (serviceType) {
        if (serviceType === 2 && parse(start_date) >= parse(end_date)) {
          const endDate = parse(start_date);
          const parseDate = parse(endDate.setDate(endDate.getDate() + 1));
          newEndDate = format(parseDate, DATE_FORMAT_YYYY_MM_DD);
        } else if (serviceType === 2 && parse(start_date) < parse(end_date)) {
          newEndDate = end_date;
        } else if (hasDateRange && day && parse(start_date) < parse(end_date)) {
          const serviceDuration = calculateDays(start_date, end_date);
          newEndDate = addDaysToDate(
            start_date,
            Number(serviceDuration) - 1 || 1
          );
        } else if (!hasDateRange) {
          newEndDate = start_date;
        } else if (serviceType === 9 && parse(start_date) >= parse(end_date)) {
          newEndDate = addDaysToDate(start_date, nights);
        }
      } else {
        if (parse(end_date) < parse(start_date)) {
          newEndDate = start_date;
        }
      }
      return newEndDate;
    },
    setStartDateToNewServiceByIdServiceType(
      serviceType,
      { end_date, start_date }
    ) {
      let newStartDate = start_date;
      const isAccoPackService =
        this.helpers.isAccommodationPackageService(serviceType);

      if (isAccoPackService && parse(start_date) >= parse(end_date)) {
        const newEndDate = parse(end_date);
        const parsedEndDate = parse(
          newEndDate.setDate(newEndDate.getDate() - 1)
        );
        newStartDate = format(parsedEndDate, DATE_FORMAT_YYYY_MM_DD);
      } else if (parse(start_date) >= parse(end_date)) {
        newStartDate = end_date;
      }

      return newStartDate;
    },
    async loadNewServiceAndSearchServicesPayload(id_service_type) {
      if (this.itinerary?.data) {
        this.getDestinationsPerCountry(this.newService.country);
        const currentService =
          this.servicesItinerary[this.servicesItinerary.length - 1];
        this.updateSearchServicesPayload("", "", {
          code: "",
          from: currentService.start_date,
          to: currentService.end_date,
          location: this.newService.location,
          country: this.newService.country,
          contract: this.itinerary.data.contract_id,
          contract_user: this.itinerary.data.client.id,
          id_service_type,
        });
        this.newService.id_service_type = id_service_type;
        this.newService.contract_user = this.itinerary.data.client.id;
        this.newService.contract = this.itinerary.data.contract_id;
        this.newService.code = "";
        this.newService.start_date = currentService.start_date;
        this.newService.end_date = currentService.end_date;
        this.$store.dispatch("services/resetServices");
      }
    },
    openMassiveModal() {
      this.showServiceMassiveModal = true;
    },
    closeServiceMassiveModal() {
      this.showServiceMassiveModal = false;
    },
    openServiceInsertBetweenDestinationsModal() {
      this.showServiceInsertBetweenDestinationsModal = true;
    },
    showServiceAlertsModal(data) {
      if (this.isServiceAlertsModalOpen) return false;
      if (this.showServiceMassiveModal) return false;
      if (this.isUpdateItineraryDatesModalOpen) return false;
      if (
        [SERVICE_ROW_FIELDS.START_DATE, SERVICE_ROW_FIELDS.END_DATE].includes(
          data.field.key
        )
      ) {
        const daysToMove = datesHelper.getDatesDiffByDates(
          data.item.start_date,
          data.previousValue
        );
        if (Math.abs(daysToMove) > 10) {
          this.serviceAlertsModalText = `You are trying to move <strong>${
            daysToMove > 0 ? "forward" : "back"
          } ${Math.abs(daysToMove)} days</strong>, are you sure?`;
          this.openServiceAlertsModal();
          return true;
        }
      }
      return false;
    },
    validateIfDisplayAlerts(field = "", data = {}) {
      if (
        ![
          SERVICE_ROW_FIELDS.START_DATE,
          SERVICE_ROW_FIELDS.END_DATE,
          SERVICE_ROW_FIELDS.DAY,
        ].includes(field)
      )
        return false;

      const isDateRangeByServiceType = [
        SERVICE_TYPE.ACCOMMODATION,
        SERVICE_TYPE.PACKAGE,
        SERVICE_TYPE.TRANSFER,
      ].includes(data.item.id_service_type);

      const hasServiceDateRange =
        data.previousValue !== data.item.end_date || isDateRangeByServiceType;

      const showServiceAlertsModal = this.showServiceAlertsModal(data);

      if (showServiceAlertsModal) {
        this.serviceEdited = {
          ...data,
          item: {
            ...data.item,
            start_date: data.item.start_date,
            end_date: hasServiceDateRange
              ? data.item.end_date
              : data.item.start_date,
          },
        };
        return true;
      }

      if (serviceHelper.isDraftService(data?.item)) return false;

      if (this.showServiceMassiveModal) return false;

      if (
        SERVICE_ROW_FIELDS.DAY === field &&
        datesHelper.getDatesDiffByDay(data.item.day, data.value) === 0
      )
        return false;

      this.serviceMassiveOptions = this.servicesItinerary
        .filter((service, index) => index > data.index)
        .map(serviceHelper.adaptServiceToServiceRow);

      if (this.serviceMassiveOptions.length === 0) return false;

      this.serviceEdited = {
        ...data,
        previousValue: data.previousValue || data.item.day,
      };

      this.openMassiveModal();
      return true;
    },
    serviceItineraryValidations(key, data) {
      if (
        (key === "end_date" || key === "day") &&
        (data.item.id_service_type === 9 ||
          this.newService.id_service_type === 9)
      ) {
        this.$buefy.toast.open({
          duration: 5000,
          message:
            "Can't edit end date of package service, if you want to change dates, please edit the start date.",
          position: "is-top",
          type: "is-danger",
        });
        return false;
      }
      if (key === "start_date") {
        const serviceListModalOpen = this.validateStartDateServiceList(
          data.value,
          data.unformatted
        );
        if (serviceListModalOpen) {
          this.currentServiceItineraryRow = { key, data };
          return false;
        }
      }
      return true;
    },
    updateItineraryServicesOrder(services = []) {
      const itineraryServices = this.servicesItinerary.map((service) => {
        const serviceToUpdate = services.find((item) => item.id === service.id);
        if (serviceToUpdate) return serviceToUpdate;
        return service;
      });

      const sortedItineraryServices = itineraryServices
        .filter((item) => item.start_date && item.order !== undefined)
        .sort((a, b) => a.order - b.order);

      const mergedItineraryServices = itineraryServices.map((item) => {
        const sortedItem = sortedItineraryServices.find(
          (sortedItem) => sortedItem.start_date === item.start_date
        );
        return sortedItem ? sortedItineraryServices.shift() : item;
      });

      this.dispatchServicesItinerary(mergedItineraryServices);
    },
    updateItineraryServicesByPayload(payload) {
      this.updateItineraryServicesOrder(payload.services);
    },
    udpateLocalSaving(payload) {
      this.updateServiceViewState("localSaving", {
        isActive: payload.isActive,
        fieldUpdated: payload.fieldUpdated,
        payload: payload.payload,
      });
    },
    resetLocalSaving() {
      this.dispatchServicesItinerary(this.initialServicesItinerary);

      return this.updateServiceViewState("localSaving", {
        isActive: false,
        payload: null,
      });
    },
    async saveItineraryServiceUpdated(payload = null) {
      this.setLoading(true);
      const response = await this.sendItineraryServiceUpdatedToAPI(
        payload?.services,
        {
          calculate_room_distribution: payload?.calculate_room_distribution,
        },
        payload?.fieldUpdated,
        payload?.cur_step,
        payload?.last_step
      );
      this.setLoading(false);
      return response;
    },
    async sendItineraryServiceUpdatedToAPI(
      services,
      params,
      fieldUpdated = "",
      cur_step = 0,
      last_step = 0
    ) {
      try {
        const data = cloneDeep(services);

        const { calculate_room_distribution, calculate_prices } = params;

        const validatedCalculatePricesParam = pricesHelper.calculatePricesParam(
          fieldUpdated,
          calculate_prices
        );

        data.forEach((service) => {
          if (validatedCalculatePricesParam === 1) {
            deleteObjectProperties(service, [
              "price",
              "price_unit",
              "cost_unit",
              "cost",
              "margin",
              "percentage_margin",
            ]);
          }
          deleteObjectProperties(service, [
            "calculate_prices",
            "direction",
            "prices_costs_margins",
            "calculate_prices",
            "level_text",
            "room",
            "price_service_sm",
            "supplier_service",
          ]);
        });
        const serviceItineraryResponse = await this.$store.dispatch(
          "itinerary/process",
          {
            data,
            calculate_prices: validatedCalculatePricesParam,
            calculate_room_distribution,
            uuid: this.$route.query.itinerary,
            sm: getSalesManualUUID(this.itinerary, this.client_contracts),
            accumulateHighlight: data[0]?.isGrouped,
            cur_step,
            last_step,
          }
        );
        if (serviceItineraryResponse?.messages?.length > 0) {
          this.handleChangeTimerCount(15);
          let type = "success";
          if (
            typeof serviceItineraryResponse["messages"][0]["errors"] !==
            "undefined"
          ) {
            type = "error";
          }
          this.$buefy.toast.open({
            duration: 5000,
            message: serviceItineraryResponse.messages[0].message,
            position: "is-top",
            type: type == "success" ? "is-success" : "is-danger",
          });
          this.handleChangeTimerCount(30);
          this.handleValidateIsEditing(false);
          this.handleItineraryServiceRecentlyAdded(data[0].id);
          return serviceItineraryResponse;
        }
      } catch (err) {
        console.info(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "Ups! something went wrong please try again.",
          position: "is-top",
          type: "is-danger",
        });
        throw err;
      }
    },
    setRoomsSelectedAccomPack(data) {
      const hasSelectedRooms = data?.room?.some((item) => item.qty > 0);

      const useDefaultServicePrice =
        data?.service_price?.every((item) => item.romm_id === 0) &&
        !hasSelectedRooms;

      if (useDefaultServicePrice) return data?.service_price;

      const nights =
        data.id_service_type === SERVICE_TYPE.ACCOMMODATION ? data.days : 1;

      const updatedUsedRooms = serviceHelper.getUpdatedUsedRooms(
        data?.service_price,
        data?.room,
        nights
      );

      const newAddedRooms = serviceHelper.getNewAddedRooms(
        updatedUsedRooms,
        data?.room,
        nights
      );

      return [...updatedUsedRooms, ...newAddedRooms];
    },
    updateDayAndStartDateServiceItineraryForm(key, data, updatedData) {
      const id_service_type = data.item.id_service_type;
      if (key === "day") {
        const { day, startDate, endDate, error, message } = setDatesFromDay(
          data.value,
          id_service_type,
          this.itinerary.data && this.itinerary.data.start_date
            ? this.itinerary.data.start_date
            : ""
        );
        updatedData.day = day;
        if (error) {
          this.$buefy.toast.open({
            duration: 2000,
            message: message,
            position: "is-top",
            type: "is-danger",
          });
          return false;
        }
        updatedData.start_date = startDate;
        updatedData.end_date = endDate;
      }
      if (key === SERVICE_ROW_FIELDS.START_DATE) {
        updatedData.oldValue = data.unformatted;
        const newEndDate = this.setEndDateToNewServiceByIdServiceType(
          id_service_type,
          updatedData
        );
        updatedData.end_date = newEndDate;
        updatedData.day = setDay(
          data.value,
          updatedData.end_date,
          this.itinerary.data,
          this.newItineraryStartDate
        );
      }
      return updatedData;
    },
    updateItineraryServiceCommonFieldsInRow(key, data, id_service_type) {
      if (this.$route.query.itinerary) {
        const updatedData = data.item;
        this.updateDayAndStartDateServiceItineraryForm(key, data, updatedData);
        if (key === SERVICE_ROW_FIELDS.END_DATE) {
          const newStartDate = this.setStartDateToNewServiceByIdServiceType(
            id_service_type,
            updatedData
          );
          updatedData.start_date = newStartDate;
          updatedData.day = setDay(
            updatedData.start_date,
            updatedData.end_date,
            this.itinerary.data
          );
        }
        if (key === "level_text") {
          updatedData.level_text = data.value;
          updatedData.level = setLevel(data.value);
          setItemToLocalStorage(this.$route.query.itinerary, {
            ...JSON.parse(localStorage.getItem(this.$route.query.itinerary)),
            level_text: data.value,
            level: setLevel(data.value),
          });
        }
        if (key === "percentage_margin") {
          const { newMargin, newPrice, newPriceUnit } =
            this.calculatePriceItineraryService(
              updatedData,
              "percentage_margin"
            );
          updatedData.price = newPrice;
          updatedData.margin = newMargin;
          updatedData.price_unit = newPriceUnit;
        }
        if (key === "price") {
          const {
            newMargin,
            newPercentageMargin,
            newPriceUnit,
            newServicePrice,
          } = this.calculatePriceItineraryService(updatedData, "price");
          updatedData.margin = newMargin;
          updatedData.percentage_margin = newPercentageMargin;
          updatedData.price_unit = newPriceUnit;
          updatedData.service_price = newServicePrice;
        }
        if (key === "margin") {
          const { newPrice, newPercentageMargin, newPriceUnit } =
            this.calculatePriceItineraryService(updatedData, "margin");
          updatedData.price = newPrice;
          updatedData.percentage_margin = newPercentageMargin;
          updatedData.price_unit = newPriceUnit;
        }
        return updatedData;
      }
    },
    async updateNewItineraryServiceRow(key, data) {
      if (this.$route.query.itinerary) {
        const updatedData = this.updateItineraryServiceCommonFieldsInRow(
          key,
          data,
          this.newService.id_service_type
        );
        updatedData.country = this.newService.country;
        updatedData.location = this.newService.location;
        if (key === "level_text") {
          this.newService.level_text = updatedData.level_text;
          this.newService.level = updatedData.level;
        }
        if (
          key === "percentage_margin" ||
          key === "margin" ||
          key === "price"
        ) {
          this.newService.price = updatedData.price;
          this.newService.price_unit = updatedData.price_unit;
          this.newService.margin = updatedData.margin;
          this.newService.percentage_margin = updatedData.percentage_margin;
        }
        if (
          (key === "num_pax" ||
            key === SERVICE_ROW_FIELDS.START_DATE ||
            key === SERVICE_ROW_FIELDS.END_DATE ||
            key === "day") &&
          this.newService.service
        ) {
          // set prices only when create services and edit num_pax, dates or day
          await this.getFullServiceWithPrices(null, updatedData);
        }
        return updatedData;
      }
    },
    updateNewServiceItineraryForm(properties) {
      if (Array.isArray(properties) && properties.length) {
        properties.forEach(([key, value]) => {
          this.newService[key] = value;
        });
      }
    },
    updateServiceItineraryDates(services, newStartDate) {
      if (services && services.length) {
        services.forEach((service) => {
          const { startDate, endDate } = setDatesFromDay(
            service.day,
            service.id_service_type,
            newStartDate
          );
          service.start_date = startDate;
          service.end_date = endDate;
          service.calculate_prices = 1;
        });
      }
      return services;
    },
    saveItineraryUpdated(data) {
      if (this.$route.query.itinerary) {
        setItemToLocalStorage(this.$route.query.itinerary, {
          ...JSON.parse(localStorage.getItem(this.$route.query.itinerary)),
          from: format(parse(data.start_date), DATE_FORMAT_YYYY_MM_DD),
          to: format(parse(data.end_date), DATE_FORMAT_YYYY_MM_DD),
        });
        return this.$store.dispatch("itinerary/update", data);
      }
    },
    async updateItineraryDates() {
      try {
        const currentItinerary = cloneDeep(this.itinerary.data);
        const currentItineraryDuration = calculateDays(
          currentItinerary.start_date,
          currentItinerary.end_date
        );
        currentItinerary.start_date = this.newItineraryStartDate;
        currentItinerary.end_date = addDaysToDate(
          this.newItineraryStartDate,
          currentItineraryDuration - 1
        );

        currentItinerary.client_id = currentItinerary.client.id;
        currentItinerary.currency_id = currentItinerary.currency.id;
        currentItinerary.language_id = currentItinerary.language.id;
        currentItinerary.status = currentItinerary.status.id;

        deleteObjectProperties(currentItinerary, [
          "client",
          "currency",
          "language",
        ]);

        this.setLoading(true);
        const response = await this.saveItineraryUpdated(currentItinerary);
        if (response) {
          this.setLoading(false);
          return response;
        }
        throw new Error("Cannot update itinerary dates, please try again!");
      } catch (err) {
        throw err;
      }
    },
    updateServicesDays(servicesItinerary) {
      if (servicesItinerary && servicesItinerary.length) {
        servicesItinerary.forEach((serviceItinerary) => {
          serviceItinerary.day = setDay(
            serviceItinerary.start_date,
            serviceItinerary.end_date,
            this.itinerary.data,
            this.newItineraryStartDate
          );
        });
      }
      return servicesItinerary;
    },
    updateServicesItineraryDatesAndSave(type) {
      const { key, data } = this.currentServiceItineraryRow;
      data.item[key] = data.value;

      let servicesToUpdate = [];
      const itineraryServices = cloneDeep(this.services_itinerary);

      if (type === "all") {
        servicesToUpdate = this.updateServiceItineraryDates(
          itineraryServices,
          data.item.start_date
        );
        const updatedRowData = this.updateDayAndStartDateServiceItineraryForm(
          key,
          data,
          data.item
        );
        servicesToUpdate[data.index] = updatedRowData;
      } else if (type === "only") {
        servicesToUpdate = itineraryServices;
        const updatedRowData = this.updateDayAndStartDateServiceItineraryForm(
          key,
          data,
          data.item
        );
        servicesToUpdate[data.index] = updatedRowData;
        servicesToUpdate = this.updateServicesDays(servicesToUpdate);
      }

      servicesToUpdate[0].calculate_prices = 1;

      this.updateItineraryDates(servicesToUpdate)
        .then(() => this.sendItineraryServiceUpdatedToAPI(servicesToUpdate))
        .then(() => {
          this.handleChangeTimerCount(30);
          this.handleItineraryServiceRecentlyAdded(
            servicesToUpdate[data.index].id
          );
          this.openModal = "";
        })
        .catch((err) => {
          this.setLoading(false);
          console.info(err.response);
          this.$buefy.toast.open({
            duration: 5000,
            message:
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "Ups! something went wrong please try again.",
            position: "is-top",
            type: "is-danger",
          });
          throw err;
        });
    },
    validateStartDateServiceList(startDate, originalStartDate) {
      const itineraryStartDate =
        this.itinerary.data && this.itinerary.data.start_date
          ? this.itinerary.data.start_date
          : null;
      this.newItineraryStartDate = null;
      if (
        itineraryStartDate &&
        startDate &&
        parse(originalStartDate) <= parse(itineraryStartDate) &&
        parse(startDate) < parse(itineraryStartDate)
      ) {
        this.newItineraryStartDate = startDate;
        this.openModal = "infoModal";
        this.modalMessage =
          "Looks it's possible to make the update! Please choose one of the following options, keep in mind we will update services and itinerary dates and this can change in price or logistic challenges, after this change review carefully the service list to avoid inconvenience.";
        return true;
      } else if (
        itineraryStartDate &&
        startDate &&
        parse(originalStartDate) > parse(itineraryStartDate) &&
        parse(startDate) < parse(itineraryStartDate)
      ) {
        this.openModal = "errorModal";
        this.modalMessage =
          "Sorry, we cannot change the start date of this service to an earlier date than itinerary start date.";
        return true;
      }
      return false;
    },
    validateIfServiceHasNightsAndHideEndDate(data) {
      if (data) {
        const service = data.item;
        const startDate = format(
          parse(service.start_date),
          DATE_FORMAT_YYYY_MM_DD
        );
        const endDate = format(parse(service.end_date), DATE_FORMAT_YYYY_MM_DD);
        const activeRow = document.getElementsByTagName("tr")[data.index + 1];
        let activeCell = null;
        if (activeRow) {
          const endDateTd =
            activeRow.getElementsByClassName("editable days")[1];
          if (endDateTd) {
            activeCell = endDateTd.getElementsByClassName("data-cell");
          }
        }

        if (startDate === endDate) {
          if (activeCell && activeCell.length) {
            activeCell[0].style.display = "none";
          }
          return false;
        }
        if (activeCell && activeCell.length) {
          activeCell[0].style.display = "block";
        }
      }
      return true;
    },
    getEditableTableClass() {
      const tableClass = [
        this.validateIsEditing ? "disabled-table" : "",
        "editable-table mb-0",
        this.disableQuoteByStatus || this.hideElementByCondition
          ? "disabled-table all unless__no_affected_fields"
          : "",
      ];
      return tableClass;
    },
    focusedGuideBoxClass(classDefault, step, bgWhite = false) {
      const bgWhiteClass = bgWhite ? "bg-white" : "";
      const checkStep = step.length
        ? step.includes(this.userGuideStep)
        : this.userGuideStep === step;
      return this.isUserGuideActive && checkStep && !this.loading
        ? `${classDefault} is-guide-step ${bgWhiteClass}`
        : classDefault;
    },
    nextStep() {
      if (this.isUserGuideActive) this.$store.dispatch("userguide/nextStep");
    },
    isDateGuideStep() {
      const dateGuideStep = 25;
      return this.userGuideStep === dateGuideStep;
    },
    hasRangeSelection(service) {
      return (
        this.hasDateRange(service) &&
        !serviceHelper.isPackageService(service.id_service_type)
      );
    },
    hasDateRange(service) {
      const isDraftService = serviceHelper.isDraftService(service);
      const isDateRangeByServiceType = [
        SERVICE_TYPE.ACCOMMODATION,
        SERVICE_TYPE.PACKAGE,
        SERVICE_TYPE.TRANSFER,
      ].includes(service.id_service_type);
      return (
        ((service.start_date !== service.end_date ||
          isDateRangeByServiceType) &&
          service.dates?.length > 0) ||
        isDraftService
      );
    },
    loadOptionsForTableFields(fields) {
      return serviceHelper.loadOptionsForTableFields(fields, this.numPax);
    },
    updateServiceViewState(key = "", newValue = "") {
      this.$emit("update:updateServiceViewState", key, newValue);
    },
    openSidebarToEditNotes(service) {
      this.handleClickServiceRowCard(
        service,
        EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO,
        SERVICE_ROW_FIELDS.NOTES
      );
    },
    onAddServiceClick() {
      this.nextStep();
      this.preventCreateNewService();
      this.newService = {
        ...this.newService,
        start_date: this.servicesItinerary.at(-1).start_date,
        end_date: this.servicesItinerary.at(-1).end_date,
      };
      if (this.isMobileView) {
        this.handleClickServiceRowCard(
          this.newService,
          EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO
        );
      }
    },
    openSidebarPricingSection(service) {
      return this.alertActivated(service)
        ? EDIT_SERVICE_SIDEBAR_TABS_IDS.PRICING
        : EDIT_SERVICE_SIDEBAR_TABS_IDS.INFO;
    },
  },
  props: {
    loadingSkeleton: {
      type: Boolean,
      default: false,
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
    rootEditServiceModal: {
      type: Boolean,
      default: false,
    },
    defaultOpenedTab: {
      type: Number,
      default: 0,
    },
    editServiceSidebarFocusedElement: {
      type: String,
      default: "",
    },
    rootServiceIdToEdit: {
      type: String,
      default: "",
    },
    rootServiceEdited: {
      type: Object,
      default: null,
    },
    deleteServices: {
      type: Function,
      default: () => {},
    },
    handleModalEditServiceModal: {
      type: Function,
      default: () => {},
    },
    validateIsEditing: {
      type: Boolean,
      default: false,
    },
    handleValidateIsEditing: {
      type: Function,
      default: () => {},
    },
    updateSearchServicesPayload: {
      type: Function,
      default: () => {},
    },
    timerCount: {
      type: Number,
      default: 0,
    },
    hideBasicInfo: {
      type: Boolean,
      default: false,
    },
    handleSearchServicesContract: {
      type: Function,
    },
    handleSearchService: {
      type: Function,
    },
    handleChangeTimerCount: {
      type: Function,
    },
    handleItineraryServiceRecentlyAdded: {
      type: Function,
    },
    getDestinationsPerCountry: {
      type: Function,
    },
    getServicePrice: {
      type: Function,
      default: () => {},
    },
    getServices: {
      type: Function,
      default: () => {},
    },
    getParentLocation: {
      type: Function,
      default: () => {},
    },
    passengers_itinerary: {
      type: [Array, Object],
      default: () => [],
    },
    handleRemoveService: {
      type: Function,
      default: () => {},
    },
    removeService: {
      type: Boolean,
      default: false,
    },
    modalPreventExitService: {
      type: Boolean,
      default: false,
    },
    handleModalExitService: {
      type: Function,
      default: () => {},
    },
    saveItineraryServiceWithPrices: {
      type: Function,
      default: () => {},
    },
    createItineraryServiceForm: {
      type: Function,
      default: () => {},
    },
    validateFunctionExecution: {
      type: Function,
      default: () => {},
    },
    localSaving: {
      type: Object,
      default: () => {},
    },
    dispatchServicesItinerary: {
      type: Function,
      default: () => {},
    },
    cancelItineraryServicesReordering: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.$store.dispatch("currency/getCurrencies");
    this.resetNewService();
    const editableElement = document.querySelector(".tableServiceTable");
    editableElement.addEventListener(
      "keydown",
      this.handleServiceTableKeyDownEvents
    );
  },
  computed: {
    editServiceModal: {
      get() {
        return this.rootEditServiceModal;
      },
      set(newValue) {
        this.updateServiceViewState("editServiceModal", newValue);
      },
    },
    serviceIdToEdit: {
      get() {
        return this.rootServiceIdToEdit;
      },
      set(newValue) {
        this.updateServiceViewState("serviceIdToEdit", newValue);
      },
    },
    serviceEdited: {
      get() {
        return this.rootServiceEdited;
      },
      set(newValue) {
        this.updateServiceViewState("serviceEdited", newValue);
      },
    },
    fields: {
      get() {
        return this.loadOptionsForTableFields(this.getFilteredTableFields);
      },
      set(newValue) {
        return newValue;
      },
    },
    hasEditServicePricesPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    hasViewServiceNotesPermission() {
      return !helpers.hasAnyRoles(
        this.authData.user,
        [USER_ROLE.TRAVEL_AGENT],
        false
      );
    },
    servicesItinerary: {
      get() {
        const newServicesItinerary = this.services_itinerary.map((ser) => {
          const price_unit = ser.service_price.reduce((price, room) => {
            return price + room.price_unit;
          }, 0);
          const isServiceImporting = this.itinerary.importing.includes(ser.id);
          const isServiceLoading =
            this.servicesLoading.items.find(
              (loadingService) => loadingService.id === ser.id
            ) !== undefined;
          const isServiceOnDisableLoading =
            this.itinerary?.disableLoading?.includes(ser.id) || false;

          if (isServiceImporting || isServiceLoading) {
            const setServiceLoading = isServiceOnDisableLoading
              ? false
              : isServiceImporting || isServiceLoading;
            if (isServiceOnDisableLoading) {
              this.$store.dispatch("itinerary/updateEntitiesImportingList", {
                disableLoading: this.itinerary.disableLoading.filter(
                  (serviceId) => serviceId !== ser.id
                ),
              });
            }
            this.updateServicesLoading(
              ser,
              setServiceLoading,
              "Updating service...",
              false
            );
          }

          const serviceLoadingFound = this.servicesLoading.items.find(
            (loadingService) => loadingService.id == ser.id
          );

          return {
            ...ser,
            price_unit: ser.service_price === null ? 0 : price_unit,
            dates: this.getDatesPicker(ser),
            serviceLoading: {
              isLoading: serviceLoadingFound !== undefined,
              message:
                serviceLoadingFound !== undefined && serviceLoadingFound.message
                  ? serviceLoadingFound.message
                  : "",
            },
            selected: ser?.selected || false,
          };
        });
        return newServicesItinerary;
      },
      set(value) {
        this.dispatchServicesItinerary(value);
      },
    },
    ...mapGetters({
      client_contracts: "client/getClientContracts",
      countries: "client/getCountriesFromContract",
      itinerary: "itinerary/getItinerary",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      itineraryStatus: "itinerary/getItineraryStatus",
      itineraryServiceRecentlyAdded:
        "itinerary/getItineraryServiceRecentlyAdded",
      loading: "utils/getLoading",
      numPax: "itinerary/getNumPax",
      services_itinerary: "itinerary/getServicesItinerary",
      itineraryDays: "itineraryDays/getItineraryDays",
      services: "services/getServices",
      service: "services/getService",
      servicePrice: "prices/getServicePrice",
      searchServicesPayload: "services/getSearchServicesPayload",
      room_prefered_dist: "itinerary/getRoomPreferableDistribution",
      currencies: "currency/getCurrencies",
      user: "auth/getAuthUserData",
      authData: "auth/getAuthData",
      isUserGuideActive: "userguide/getIsUserGuideActive",
      userGuideStep: "userguide/getStep",
      isModalOpen: "utils/getIsModalOpen",
      itineraryServicesAffected: "itinerary/getItineraryServicesAffected",
      contractCountries: "client/getCountriesFromContract",
      datesFormat: "itinerary/getDatesFormat",
      serviceImportingConfirmationModal:
        "itinerary/getServiceImportingConfirmationModal",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    destinationsByCountry() {
      const destinations =
        this.countries.find(
          (country) => country.location_name === this.newService.country
        )?.destination || [];

      return serviceHelper.formatDestinationsTextForServiceTable(destinations);
    },
    servicesWithText() {
      const services =
        this.services && this.services.data ? this.services.data : [];
      if (services && services.length) {
        services.forEach((service) => {
          service.text =
            service.code + " - " + (service.name ? service.name.value : "");
        });
      }
      return services;
    },
    hasViewSalePriceCostPricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_COST_PRICE, PERMISSION.VIEW_SALE_PRICE]
      );
    },
    hasViewSalePricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_SALE_PRICE]
      );
    },
    hasViewCostPricePermission() {
      return serviceHelper.hasAnyViewPermissions(
        this.authData,
        this.itinerary,
        [PERMISSION.VIEW_COST_PRICE]
      );
    },
    getFilteredTableFields() {
      return this.initialFields.map((field) => {
        const isActionField =
          [SERVICE_TABLE_FIELDS_IDS.ACTIONS].includes(field.key) &&
          this.hideElementByCondition;
        const isPriceField =
          [SERVICE_ROW_FIELDS.PRICE].includes(field.key) &&
          !this.hasViewSalePricePermission;
        const isCostField =
          [SERVICE_ROW_FIELDS.COST].includes(field.key) &&
          !this.hasViewCostPricePermission;
        const className =
          field.class +
          (isActionField || isPriceField || isCostField ? " cellHidden" : "");
        return { ...field, class: className };
      });
    },
    itineraryCurrency() {
      return (
        this.itinerary?.data?.currency || {
          currency_sign: "",
          currency_name: "",
        }
      );
    },
    totalPrice() {
      const price = parseFloat(
        this.servicesItinerary?.reduce((a, b) => a + b.price, 0)
      );
      return formatNumber(price && price > 0 ? price.toFixed(1) : "0.00");
    },
    isMobileView() {
      return window.innerWidth <= 480;
    },
  },
};
</script>

<style>
.destinationField .selectContainer > div,
.serviceTypeField .selectContainer > div,
.countryField .selectContainer > div {
  margin: 0 auto;
}
.destinationField div > span:nth-of-type(1) {
  display: block;
  color: #b5b5b5;
  font-size: 0.7rem;
}
.destinationField .selectContainer > div {
  margin-top: 0.25rem;
}
.destinationField {
  max-width: 3rem;
}
.editable-table th[role="columnheader"] {
  text-align: center;
}
.editable-table td .data-cell {
  text-align: center;
}
table[isDateGuideStep="true"] tr:nth-of-type(2) td[aria-colindex="3"] {
  position: relative;
  z-index: 999;
  background-color: #fff;
  border-radius: 0.5rem;
}
.priceField {
  padding-left: 0.5rem;
}
td.actionsField div {
  justify-content: center !important;
}
.actionsField div {
  text-align: center;
}
.datepicker_container {
  position: relative;
  top: 3rem;
}
.datepicker_container .control > input {
  display: none;
}
.datepicker_container
  :is(.dropdown-menu, .dropdown-menu:hover, .dropdown-item, .dropdown-item:hover) {
  background-color: #fff;
  font-size: 0.7rem;
}
.datepicker_container .dropdown-item a > span.icon.has-text-primary,
.select:not(.is-multiple):not(.is-loading)::after {
  color: #1d3b83 !important;
  border-color: #1d3b83;
}
.datepicker_container .dropdown-item:active {
  background-color: #fff;
}
.datepicker_container .dropdown-content {
  box-shadow: none;
  border-radius: 0;
}
.datepicker .datepicker-table .datepicker-body .datepicker-cell.is-today {
  border: 1px solid #dee2e6;
}
.datepicker
  .datepicker-table
  .datepicker-body
  .datepicker-cell.is-selected.is-within-selected {
  background-color: #dee2e6;
}
.datepicker_container
  .datepicker
  .datepicker-table
  .datepicker-body
  .datepicker-cell.is-selected:is(.is-first-selected, .is-last-selected) {
  background-color: #1d3b83;
}
.datepicker_container
  .datepicker
  .datepicker-table
  .datepicker-body
  .datepicker-cell.is-selected:is(.is-last-selected) {
  border-radius: 0 0.3rem 0.3rem 0;
}
.dates_select_button {
  cursor: inherit;
  position: relative;
  top: -0.5rem;
}
.datesField {
  width: 6%;
}
.InputTitle {
  width: 12.5%;
  max-width: 10rem;
}
.paxField {
  text-align: center !important;
}
.days,
.countryField {
  width: 3% !important;
}
.card-icon {
  padding-left: 5px;
  color: #4d4d4d;
}
.card-icon ::before {
  font-size: 20px !important;
}

.editable-table th {
  vertical-align: middle !important;
  color: var(--gray-dark) !important;
  font-weight: 400 !important;
}

.table-bordered > :not(caption) > * {
  border-top: none;
}
.editable-table .data-cell {
  display: block;
}
.editable-table .data-cell .code-input {
  width: 6rem;
}

.editable-table .form-check {
  margin-left: 7px;
}
.ui.selection.dropdown .menu {
  max-width: 35rem;
  overflow-x: auto;
  max-height: 14rem;
}
.ui.selection.dropdown .menu > .item {
  font-size: 12px;
  padding: 0.5rem 0.5rem !important;
}

.ui.search.dropdown > .text {
  width: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 150px;
}

.ui.fluid.search.selection.dropdown.select-full:hover {
  box-shadow: 0 0 0 0.2em rgb(0 165 203 / 25%);
  background: rgb(255, 255, 235);
}

.ui.dropdown > .dropdown.icon:before {
  border: 3px solid transparent;
  border-radius: 2px;
  border-right: 0;
  border-top: 0;
  content: " ";
  display: block;
  height: 0.625em;
  margin-top: -0.4375em;
  pointer-events: none;
  position: absolute;
  top: 50%;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: center;
  transform-origin: center;
  width: 0.625em;
  border-color: var(--info-color);
}

.ui.selection.dropdown > .delete.icon,
.ui.selection.dropdown > .dropdown.icon,
.ui.selection.dropdown > .search.icon {
  font-size: 12px;
  top: 1.1em;
}
.shortcutLinkContainer {
  display: flex;
  justify-content: flex-start;
  padding-right: 0.3em;
}
.currencyHeader :is(span, strong) {
  color: #b5b5b5;
}
.cellHidden {
  display: none;
}
.disabled_field {
  opacity: 0.5;
  cursor: no-drop;
  display: inline-block;
  width: 100%;
}
.service_table_placeholder {
  text-align: center;
  padding: 2rem 0 1rem;
  color: #b5b5b5;
}
.service__table__footer {
  background-color: var(--quote-bg-color);
  position: sticky;
  z-index: 9;
  height: 50px;
  bottom: 0px;
  padding-bottom: 2.5rem;
  align-items: center;
  padding-top: 3rem;
}
.service_row_notes__placeholder {
  width: 12rem;
  height: 10rem;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
}
@media screen and (max-width: 480px) {
  .service_table__container {
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
  }
  .tableServiceTable .table thead {
    top: 0px;
  }
  .service_table__footer {
    display: none;
  }
  .save_button__container {
    position: fixed !important;
    bottom: 0rem;
    left: 0;
    background-color: #fff;
    width: 100% !important;
    padding: 1rem;
    z-index: 999;
  }
  .save_button__container button {
    width: 100% !important;
  }
  .serviceHeader {
    padding-top: 0rem !important;
  }
  .shortcutsLink {
    display: none;
  }
  .service__table__footer {
    padding: 1rem 0 0;
    height: auto;
    position: relative;
    z-index: 1;
  }
  .service_row__notes {
    display: none;
  }
}
</style>
