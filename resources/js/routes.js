import Dashboard from './components/Dashboard.vue';
import ListAppointments from "@/components/pages/appointments/ListAppointments.vue";
import ListUsers from "@/components/pages/Users/ListUsers.vue";
import UpdateSettings from "@/components/pages/Settings/UpdateSettings.vue";
import UpdateProfile from "@/components/pages/profile/UpdateProfile.vue";
import Login from "@/components/pages/auth/Login.vue";

export default [
    {
        path: '/login',
        name: 'admin.login',
        component: Login,
    },
    {
        path: '/admin/dashboard',
        name: 'admin.dashboard',
        component: Dashboard,
    },
    {
        path: '/admin/appointments',
        name: 'admin.appointments',
        component: ListAppointments,
    },
    {
        path: '/admin/users',
        name: 'admin.users',
        component: ListUsers,
    },
    {
        path: '/admin/settings',
        name: 'admin.settings',
        component: UpdateSettings,
    },
    {
        path: '/admin/profile',
        name: 'admin.profile',
        component: UpdateProfile,
    }

]
