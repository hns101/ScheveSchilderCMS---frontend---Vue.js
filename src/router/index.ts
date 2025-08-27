import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import StudentList from '../components/StudentList.vue';
import StudentDetail from '../components/StudentDetail.vue';
import InvoiceBatch from '../components/InvoiceBatch.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'StudentList', component: StudentList },
    { path: '/students/:id', name: 'StudentDetail', component: StudentDetail },
    { path: '/invoices', name: 'InvoiceBatch', component: InvoiceBatch }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
