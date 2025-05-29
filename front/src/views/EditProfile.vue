<template>
  <div>
    <NavBar />
    <div :class="[$style.main, { [$style.darkMode]: darkModeStore.isDark }]">
      <div :class="$style.contents">
        <h1 :class="$style.pageTitle">Editar Perfil</h1>
        <div :class="$style.container">
          <div :class="$style.body">
            <!-- Photo Section -->
            <div :class="$style.foto">
              <div :class="$style.profile">
                <div :class="$style.body1">
                  <div :class="$style.photoWrapper">
                    <img 
                      v-if="userPhoto" 
                      :src="userPhoto" 
                      :class="$style.photoIcon" 
                      alt="Foto do perfil" 
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

            <!-- Personal Information Section -->
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

              <!-- Location Section -->
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

          <!-- Buttons -->
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
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const userStore = useUserStore()
const darkModeStore = useDarkModeStore()

const fileInput = ref<HTMLInputElement>()
const userPhoto = ref<string>('')

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

onMounted(() => {
  // Load user data from store
  if (userStore.user) {
    formData.username = userStore.user.name || ''
    formData.email = userStore.user.email || ''
    // Don't load password for security
    formData.street = userStore.user.street || ''
    formData.neighborhood = userStore.user.neighborhood || ''
    formData.city = userStore.user.city || ''
    formData.state = userStore.user.state || ''
    formData.cep = userStore.user.cep || ''
    userPhoto.value = userStore.user.photo || ''
  }
})

function toggleEditMode(section: 'personal' | 'location') {
  editMode[section] = !editMode[section]
}

function handleChangePhoto() {
  fileInput.value?.click()
}

function onPhotoChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userPhoto.value = e.target?.result as string
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
    // Here you would make an API call to save the user data
    // For now, we'll just update the store
    userStore.updateUser({
      name: formData.username,
      email: formData.email,
      street: formData.street,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      cep: formData.cep,
      photo: userPhoto.value
    })

    // Reset edit modes
    editMode.personal = false
    editMode.location = false

    // Show success message (you can use a toast library)
    alert('Perfil atualizado com sucesso!')
    
    router.push('/')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Erro ao salvar perfil. Tente novamente.')
  }
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
  --text-disabled: #9e9e9e;
  --border-color: #333333;
  --border-color-hover: #666666;
  --input-bg: #2d2d2d;
  --input-bg-disabled: #1a1a1a;
  --divider-color: rgba(255, 255, 255, 0.12);
  --button-cancel-bg: #333333;
  --button-cancel-color: #ff6b6b;
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

/* Photo Section */
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

/* Information Sections */
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
  color: #212121;
  letter-spacing: 1px;
}

.edit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit:hover {
  background-color: #f5f5f5;
  border-color: #414141;
}

.editText {
  font-size: 16px;
  color: #414141;
}

/* Form Inputs */
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
  color: #414141;
  letter-spacing: 0.5px;
}

.inputField, .selectField {
  width: 100%;
  height: 40px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #d7d7d7;
  font-size: 14px;
  color: #414141;
  background: white;
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
  color: #757575;
}

/* Buttons */
.buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
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

/* Responsive Design */
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
</style>
