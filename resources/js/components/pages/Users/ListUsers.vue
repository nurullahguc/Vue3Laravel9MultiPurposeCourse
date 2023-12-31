<script setup>
import {onMounted, reactive, ref} from "vue";
import {Form, Field} from "vee-validate";
import * as yup from 'yup'


let users = ref([])
const editing = ref(false)
const formValues = ref()
const form = ref(null)

const getUsers = () => {
    axios.get('/api/users')
        .then((response) => {
            console.log(response)
            users.value = response.data
        })
        .catch((error) => {
            console.error('İstek sırasında bir hata oluştu:', error);
        });


    console.log('Users refreshed...')
}

const createUser = (values, {resetForm}) => {
    axios.post('/api/users', values)
        .then((response) => {
            getUsers()
            resetForm()
            $('#userFormModal').modal('hide')
        })
}

const createUserSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(8),
})

const editUserSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().when((password, schema) => {
        return password != '' ? schema.required().min(8) : schema
    }),
})


const editUser = (user) => {
    // console.log(user)
    form.value.resetForm()
    editing.value = true
    $('#userFormModal').modal()
    formValues.value = {
        id: user.id,
        name: user.name,
        email: user.email,
    }
}

const updateUser = (values) => {

    axios.put('/api/users/' + formValues.value.id, values)
        .then((response) => {
            const index = users.value.findIndex(user => user.id === response.data.id);
            users.value[index] = response.data
            $('#userFormModal').modal('hide')
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            form.value.resetForm()
        })

}

const addUser = () => {
    editing.value = false
    $('#userFormModal').modal()
}


const handleSubmit = (values) => {
    if (editing.value)
        updateUser(values)
    else
        createUser(values)
}


onMounted(() => {
    getUsers()
})

</script>

<template>
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Users</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active">Appointments</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>


    <div class="content">
        <div class="container-fluid">
            <div class="row m-3">
                <div class="col-md-6">
                    <button @click="addUser" style="display: inline; float: left;" type="button"
                            class="btn btn-primary ">Add New
                        User
                    </button>
                </div>

                <div class="col-md-6">
                    <button @click="getUsers()" style="display: inline; float: right;" type="button"
                            class="btn btn-secondary">Refresh Users
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th style="width: 10px">#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered Date</th>
                            <th>Role</th>
                            <th>Options</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(user, index) in users" :key="user.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <a href="#">
                                    <i @click.prevent="editUser(user)" class="fa fa-edit"></i>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="userFormModal" data-backdrop="static" tabindex="-1" role="dialog"
         aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">
                        <span v-if="editing">Edit User</span>
                        <span v-else>Add New User</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <Form ref="form" @submit="handleSubmit"
                      :validation-schema="editing ? editUserSchema : createUserSchema"
                      v-slot:="{ errors }" :initial-values="formValues">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <Field name="name" type="text" class="form-control" :class="{ 'is-invalid' : errors.name }"
                                   id="name"
                                   aria-describedby="nameHelp"
                                   placeholder="Enter full name"/>
                            <span class="invalid-feedback">{{ errors.name }}</span>
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <Field name="email" type="email" class="form-control"
                                   :class="{ 'is-invalid' : errors.email }" id="email"
                                   aria-describedby="nameHelp"
                                   placeholder="Enter full name"/>
                            <span class="invalid-feedback">{{ errors.email }}</span>
                        </div>

                        <div class="form-group">
                            <label for="email">Password</label>
                            <Field name="password" type="password" class="form-control"
                                   id="password" :class="{ 'is-invalid' : errors.password }"
                                   aria-describedby="nameHelp"
                                   placeholder="Enter password"/>
                            <span class="invalid-feedback">{{ errors.password }}</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>

</template>
