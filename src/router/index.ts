import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import StudentList from '../components/StudentList.vue';
import StudentDetail from '../components/StudentDetail.vue';
import StudentForm from '../components/StudentForm.vue';
import InvoiceBatch from '../components/InvoiceBatch.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'StudentList', component: StudentList },
    { path: '/students/:id', name: 'StudentDetail', component: StudentDetail },
    { path: '/students/new', name: 'AddStudent', component: StudentForm },
    { path: '/students/:id/edit', name: 'EditStudent', component: StudentForm, props: true },
    { path: '/invoices', name: 'InvoiceBatch', component: InvoiceBatch }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
