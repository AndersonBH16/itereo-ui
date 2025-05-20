<template>
  <div class="flex">
    <div
      class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 bg-white shadow rounded-t-md"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <img
            class="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
        </div>
      </div>
      <nav class="mt-10 mb-10">
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[
            $route.name === 'BasicInformation' ? activeClass : inactiveClass,
          ]"
          :to="{ path: paths.BASIC_INFO.path }"
        >
          <IconBasicInfo class="h-6 w-6" />
          <span class="mx-4">Basic Information</span>
        </router-link>
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[$route.name === 'Services' ? activeClass : inactiveClass]"
          :to="{ path: paths.SERVICES.path }"
        >
          <IconServices class="h-6 w-6" />
          <span class="mx-4">Services</span>
        </router-link>

        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[$route.name === 'Itinerary' ? activeClass : inactiveClass]"
          :to="{ path: paths.ITINERARY.path }"
        >
          <IconItinerary class="h-6 w-6" />
          <span class="mx-4">Itinerary</span>
        </router-link>

        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[
            $route.name === 'PaxInformation' ? activeClass : inactiveClass,
          ]"
          :to="{ path: paths.PAX_INFO.path }"
        >
          <IconPaxInfo class="h-6 w-6" />
          <span class="mx-4">Pax Information</span>
        </router-link>

        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[$route.name === 'Export' ? activeClass : inactiveClass]"
          :to="{ path: paths.EXPORT.path }"
        >
          <IconExport class="h-6 w-6" />
          <span class="mx-4">Export</span>
        </router-link>

        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 mx-3 hover:bg-indigo-700 hover:text-white rounded-md"
          :class="[
            $route.name === 'Configuration' ? activeClass : inactiveClass,
          ]"
          :to="{ path: paths.CONFIGURATION.path }"
        >
          <IconConfig class="h-6 w-6" />
          <span class="mx-4">Configuration</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { PATH_INFO } from "@/router/path";

export default {
  name: "BaseNavLeft",
  data() {
    return {
      paths: { ...PATH_INFO },
    };
  },
};
</script>
