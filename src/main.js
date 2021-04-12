import { createApp } from "vue";
import ServerTable from "./components/server-table/server_table.vue";
import ClientTable from "./components/client-table/client_table.vue";
import App from "./App.vue";

// Vue.use({install: ServerTable.install});
// Vue.use({install: ClientTable.install});

createApp(App).mount("#app");