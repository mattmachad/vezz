<template>
  <div>
    <NavBar />
    <div :class="[$style.main, { [$style.darkMode]: darkModeStore.isDark }]">
      <div :class="$style.contents">
        <h1 :class="$style.pageTitle">Editar Perfil</h1>
        <div :class="$style.container">
          <div :class="$style.body">
            <div :class="$style.foto">
              <div :class="$style.profile">
                <div :class="$style.body1">
                  <div :class="$style.photoWrapper">
                    <div v-if="isLoadingPhoto" :class="$style.photoPlaceholder">
                      <span>Carregando...</span>
                    </div>
                    <img 
                      v-else-if="userPhoto" 
                      :src="userPhoto" 
                      :class="$style.photoIcon" 
                      alt="Foto do perfil"
                      @error="handleImageError"
                    />
                    <div v-else :class="$style.photoPlaceholder">
                      <span>Sem foto</span>
                    </div>
                  </div>
                  <div :class="$style.btn">
                    <button :class="$style.vBtn" @click="handleChangePhoto">
                      <div :class="$style.content">
                        <div :class="$style.text">Trocar Foto</div>
                      </div>
                    </button>
                    <input 
                      ref="fileInput" 
                      type="file" 
                      accept="image/*" 
                      style="display: none" 
                      @change="onPhotoChange"
                    />
                  </div>
                </div>
              </div>
              <div :class="$style.vDivider" />
            </div>

            <div :class="$style.blocks">
              <div :class="$style.informaesPessoais">
                <div :class="$style.head">
                  <div :class="$style.sectionTitle">Informações Pessoais</div>
                  <button :class="$style.edit" @click="toggleEditMode('personal')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#414141"/>
                    </svg>
                    <div :class="$style.editText">Editar</div>
                  </button>
                </div>
                <div :class="$style.inputs">
                  <div :class="$style.inputGroup">
                    <div :class="$style.inputLabel">
                      <div :class="$style.labelText">Nome de usuário:</div>
                    </div>
                    <input 
                      v-model="formData.username" 
                      :disabled="!editMode.personal"
                      :class="$style.inputField"
                      type="text"
                      placeholder="Digite seu nome de usuário"
                    />
                  </div>
                  <div :class="$style.inputGroup">
                    <div :class="$style.inputLabel">
                      <div :class="$style.labelText">Email:</div>
                    </div>
                    <input 
                      v-model="formData.email" 
                      :disabled="!editMode.personal"
                      :class="$style.inputField"
                      type="email"
                      placeholder="Digite seu email"
                    />
                  </div>
                  <div :class="$style.inputGroup">
                    <div :class="$style.inputLabel">
                      <div :class="$style.labelText">Senha:</div>
                    </div>
                    <input 
                      v-model="formData.password" 
                      :disabled="!editMode.personal"
                      :class="$style.inputField"
                      type="password"
                      placeholder="Digite sua senha"
                    />
                  </div>
                </div>
              </div>

              <div :class="$style.informaesPessoais">
                <div :class="$style.head">
                  <div :class="$style.sectionTitle">Localização</div>
                  <button :class="$style.edit" @click="toggleEditMode('location')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#414141"/>
                    </svg>
                    <div :class="$style.editText">Editar</div>
                  </button>
                </div>
                <div :class="$style.inputsAdress">
                  <div :class="$style.adressInfo">
                    <div :class="$style.inputGroup">
                      <div :class="$style.inputLabel">
                        <div :class="$style.labelText">Rua:</div>
                      </div>
                      <input 
                        v-model="formData.street" 
                        :disabled="!editMode.location"
                        :class="$style.inputField"
                        type="text"
                        placeholder="Digite sua rua"
                      />
                    </div>
                    <div :class="$style.inputGroup">
                      <div :class="$style.inputLabel">
                        <div :class="$style.labelText">Bairro:</div>
                      </div>
                      <input 
                        v-model="formData.neighborhood" 
                        :disabled="!editMode.location"
                        :class="$style.inputField"
                        type="text"
                        placeholder="Digite seu bairro"
                      />
                    </div>
                    <div :class="$style.inputGroup">
                      <div :class="$style.inputLabel">
                        <div :class="$style.labelText">Cidade:</div>
                      </div>
                      <input 
                        v-model="formData.city" 
                        :disabled="!editMode.location"
                        :class="$style.inputField"
                        type="text"
                        placeholder="Digite sua cidade"
                      />
                    </div>
                    <div :class="$style.inputGroup">
                      <div :class="$style.inputLabel">
                        <div :class="$style.labelText">Estado:</div>
                      </div>
                      <select 
                        v-model="formData.state" 
                        :disabled="!editMode.location"
                        :class="$style.selectField"
                      >
                        <option value="">Selecione o estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                    <div :class="$style.inputGroup">
                      <div :class="$style.inputLabel">
                        <div :class="$style.labelText">CEP:</div>
                      </div>
                      <input 
                        v-model="formData.cep" 
                        :disabled="!editMode.location"
                        :class="$style.inputField"
                        type="text"
                        placeholder="00000-000"
                        @input="formatCep"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div :class="$style.buttons">
            <button :class="$style.vBtn1" @click="handleCancel">
              <div :class="$style.content">
                <div :class="$style.text1">CANCELAR</div>
              </div>
            </button>
            <button :class="$style.vBtn2" @click="handleSave">
              <div :class="$style.content">
                <div :class="$style.text1">SALVAR</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDarkModeStore } from '@/stores/darkMode'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

interface User {
  id: number
  name: string
  email: string
  photo?: string
}

const router = useRouter()
const userStore = useUserStore()
const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()
const toast = useToast()

const fileInput = ref<HTMLInputElement>()
const userPhoto = ref<string>('')
const selectedFile = ref<File | null>(null)
const isLoadingPhoto = ref(true)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  cep: ''
})

const editMode = reactive({
  personal: false,
  location: false
})

async function loadUserPhoto(userId: number) {
  try {
    const response = await fetch(`http://localhost:3003/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao carregar foto do perfil')
    }

    const userData = await response.json()
    
    if (userData.picture) {
      if (userData.picture.startsWith('http')) {
        userPhoto.value = userData.picture
      } else {
        userPhoto.value = `http://localhost:3003/${userData.picture.replace(/^\//, '')}`
      }
    } else {
      userPhoto.value = ''
    }
  } catch (error) {
    userPhoto.value = ''
  } finally {
    isLoadingPhoto.value = false
  }
}

onMounted(async () => {
  try {
    authStore.init()
    
    const userId = authStore.user?.id
    
    if (!userId) {
      toast.error('Usuário não encontrado')
      router.push('/')
      return
    }

    await loadUserPhoto(userId)

    const response = await fetch(`http://localhost:3003/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao carregar dados do usuário')
    }

    const userData = await response.json()

    formData.username = userData.name || ''
    formData.email = userData.email || ''
    formData.street = userData.street || ''
    formData.neighborhood = userData.neighborhood || ''
    formData.city = userData.city || ''
    formData.state = userData.state || ''
    formData.cep = userData.cep || ''

    userStore.updateUser(userData)

  } catch (error: any) {
    toast.error(error.message || 'Erro ao carregar dados do perfil')
  }
})

function toggleEditMode(section: 'personal' | 'location') {
  editMode[section] = !editMode[section]
}

function handleChangePhoto() {
  fileInput.value?.click()
}

async function onPhotoChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      userPhoto.value = e.target?.result as string
    }
    reader.onerror = () => {
      toast.error('Erro ao carregar a imagem')
    }
    reader.readAsDataURL(file)
  }
}

function formatCep(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  
  if (value.length > 5) {
    value = value.substring(0, 5) + '-' + value.substring(5, 8)
  }
  
  formData.cep = value
}

function handleCancel() {
  router.push('/')
}

async function handleSave() {
  try {
    const userId = authStore.user?.id
    if (!userId) {
      throw new Error('Usuário não encontrado')
    }

    const formDataToSend = new FormData()

    if (selectedFile.value) {
      formDataToSend.append('file', selectedFile.value)
    }

    interface UserUpdateData {
      name?: string
      email?: string
      password?: string
      street?: string
      neighborhood?: string
      city?: string
      state?: string
      cep?: string
      picture?: string
    }

    const userData: UserUpdateData = {}
    
    if (formData.username) userData.name = formData.username
    if (formData.email) userData.email = formData.email
    if (formData.password) userData.password = formData.password
    if (formData.street) userData.street = formData.street
    if (formData.neighborhood) userData.neighborhood = formData.neighborhood
    if (formData.city) userData.city = formData.city
    if (formData.state) userData.state = formData.state
    if (formData.cep) userData.cep = formData.cep

    formDataToSend.append('userData', JSON.stringify(userData))

    const response = await fetch(`http://localhost:3003/users/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formDataToSend
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }

    const updatedUser = await response.json()

    userStore.updateUser(updatedUser)
    authStore.login(updatedUser)

    editMode.personal = false
    editMode.location = false

    toast.success('Perfil atualizado com sucesso!')
    router.push('/')
  } catch (error: any) {
    console.error('Error saving profile:', error)
    toast.error(error.message || 'Erro ao atualizar perfil. Tente novamente.')
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement

  userPhoto.value = ''
  toast.error('Erro ao carregar a imagem do perfil')
}
</script>

<style module>
:root {
  --page-bg: #f5f5f5;
  --card-bg: #ffffff;
  --text-primary: #212121;
  --text-secondary: #414141;
  --text-disabled: #757575;
  --border-color: #d9d9d9;
  --border-color-hover: #414141;
  --input-bg: #ffffff;
  --input-bg-disabled: #f5f5f5;
  --divider-color: rgba(154, 154, 154, 0.42);
  --button-cancel-bg: #ededed;
  --button-cancel-color: #d93b3b;
  --button-cancel-hover: #d9d9d9;
  --button-save-bg: #2baeff;
  --button-save-hover: #1a9eef;
  --button-save-color: #ffffff;
}

.darkMode {
  --page-bg: #121212;
  --card-bg: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-disabled: #bdbdbd;
  --border-color: #404040;
  --border-color-hover: #666666;
  --input-bg: #2d2d2d;
  --input-bg-disabled: #1a1a1a;
  --divider-color: rgba(255, 255, 255, 0.15);
  --button-cancel-bg: #333333;
  --button-cancel-color: #ff8080;
  --button-cancel-hover: #404040;
  --button-save-bg: #2baeff;
  --button-save-hover: #1a9eef;
  --button-save-color: #ffffff;
}

.main {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: var(--page-bg);
  font-family: 'Roboto', sans-serif;
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

.contents {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pageTitle {
  font-size: 32px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 1.25px;
  margin: 0;
}

.container {
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  transition: background-color 0.3s, border-color 0.3s;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.foto {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.body1 {
  display: flex;
  align-items: center;
  gap: 32px;
}

.photoWrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--input-bg-disabled);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.photoIcon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photoPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-disabled);
  font-size: 14px;
}

.btn {
  display: flex;
  align-items: center;
}

.vBtn {
  border-radius: 8px;
  border: 1px solid var(--button-save-bg);
  background: transparent;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vBtn:hover {
  background-color: var(--button-save-bg);
}

.vBtn:hover .text {
  color: var(--button-save-color);
}

.text {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.25px;
  text-transform: uppercase;
  color: var(--button-save-bg);
  transition: color 0.3s;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vDivider {
  width: 100%;
  height: 1px;
  background-color: rgba(154, 154, 154, 0.42);
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.informaesPessoais {
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sectionTitle {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.edit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit:hover {
  background-color: var(--input-bg);
  border-color: var(--border-color-hover);
}

.editText {
  font-size: 16px;
  color: var(--text-secondary);
}

.inputs, .inputsAdress {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adressInfo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inputLabel {
  display: flex;
  align-items: center;
}

.labelText {
  font-size: 16px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.inputField, .selectField {
  width: 100%;
  height: 40px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--input-bg);
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;
}

.inputField:focus, .selectField:focus {
  outline: none;
  border-color: #2baeff;
}

.inputField:disabled, .selectField:disabled {
  background-color: #f5f5f5;
  color: #757575;
  cursor: not-allowed;
}

.inputField::placeholder {
  color: var(--text-disabled);
}

.buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.vBtn1, .vBtn2 {
  padding: 12px 32px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.vBtn1 {
  background-color: #ededed;
  color: #d93b3b;
}

.vBtn1:hover {
  background-color: #d9d9d9;
}

.vBtn2 {
  background-color: #2baeff;
  color: white;
}

.vBtn2:hover {
  background-color: #1a9eef;
}

.text1 {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.25px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .main {
    padding: 20px 16px;
  }

  .container {
    padding: 20px;
  }

  .body1 {
    flex-direction: column;
    text-align: center;
  }

  .adressInfo {
    grid-template-columns: 1fr;
  }

  .buttons {
    flex-direction: column;
    gap: 12px;
  }

  .vBtn1, .vBtn2 {
    width: 100%;
  }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.photoPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-disabled);
  font-size: 14px;
  background-color: var(--input-bg-disabled);
}

.photoPlaceholder span {
  animation: pulse 1.5s infinite ease-in-out;
}
</style>
