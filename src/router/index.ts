import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import StudentList from '../components/StudentList.vue';
import StudentDetail from '../components/StudentDetail.vue';
import StudentForm from '../components/StudentForm.vue';
import InvoiceBatch from '../components/InvoiceBatch.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'StudentList', component: StudentList },
    { path: '/students/add', name: 'AddStudent', component: StudentForm },
    { path: '/students/:id', name: 'StudentDetail', component: StudentDetail },
    { path: '/students/:id/edit', name: 'EditStudent', component: StudentForm, props: true }, // IMPORTANT: props: true added here
    { path: '/invoices', name: 'InvoiceBatch', component: InvoiceBatch }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
