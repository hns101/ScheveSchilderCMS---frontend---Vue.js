// router/index.js - Updated router without PDF Layout Editor
import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '../components/StudentList.vue'
import StudentDetail from '../components/StudentDetail.vue'
import StudentForm from '../components/StudentForm.vue'
import InvoiceBatch from '../components/InvoiceBatch.vue'
import PdfViewer from '../components/PdfViewer.vue'
import Settings from '../components/Settings.vue' // Updated Settings with PDF layout integration

const routes = [
    {
        path: '/',
        redirect: '/students'
    },
    {
        path: '/students',
        name: 'StudentList',
        component: StudentList
    },
    {
        path: '/students/new',
        name: 'AddStudent',
        component: StudentForm
    },
    {
        path: '/students/:id',
        name: 'StudentDetail',
        component: StudentDetail,
        props: true
    },
    {
        path: '/students/:id/edit',
        name: 'EditStudent',
        component: StudentForm,
        props: true
    },
    {
        path: '/invoices',
        name: 'InvoiceBatch',
        component: InvoiceBatch
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings // Now includes PDF layout functionality
    },
    {
        path: '/pdf/:type/:id',
        name: 'PdfViewer',
        component: PdfViewer,
        props: true
    }
    // REMOVED: PDF Layout Editor route
    // The PDF layout functionality is now integrated into Settings
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router