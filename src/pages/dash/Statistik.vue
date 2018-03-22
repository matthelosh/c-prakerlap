<template>
	<div class="tblSiswa">
		<v-btn @click="getAll">Lihat Semua</v-btn>
		<div v-for="guru in gurus" :key="guru._id" class="tblContainer">
			<h3 @click="getData(guru._id)" >{{ guru.nama }}</h3>
			<!-- <table border="1" v-if="guru._id == guruId"> -->
			<table border="1">
				<thead>
					<tr>
						<th>No</th>
						<th>ID/NIS</th>
						<th>Nama Siswa</th>
						<th>No. HP</th>
						<th>DU/DI</th>
						<th>Alamat Dudi</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(praktikan, index) in praktikans" :key="praktikan._id"  v-if="praktikan._guru._id == guru._id">
						<td >{{ index+1 }}</td>
						<td >{{ praktikan._id }}</td>
						<td>{{ praktikan.nama }}</td>
						<td>{{ praktikan.hp }}</td>
						<td>{{ praktikan._dudi }}</td>
						<td>{{ praktikan._dudi }}</td>
						<td>6</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data: function() {
			return {
				// praktikans: [],
				token: sessionStorage.getItem('token'),
				gurus: [],
				guruId: ''
			}
		},
		created() {
			this.getGurus();
			// this.getData(guru._id);
			this.getAll();
		},
		methods: {
			getGurus() {
				axios.get('http://localhost:4567/api/gurus', { headers: { 'X-Access-Token': this.token }})
					.then(response => {
						var gurus = response.data;
						this.gurus = gurus;
						console.log(gurus[0]._id)
					});
			},
			getData(guruId) {
				// alert(guruId);
				this.guruId = guruId;
				axios.get('http://localhost:4567/api/statistik?guru='+guruId, { headers: { 'X-Access-Token': this.token }})
					.then(response => {
						console.log(response.data);
						// this.praktikans = response.data;
					});
			},
			getAll(){
				axios.get('http://localhost:4567/api/praktikans', { headers: { 'X-Access-Token': this.token }})
					.then(response => {
						console.log(response.data[0]._guru._id);
						// this.praktikans = response.data;
					});
			}
		},
		computed: {
			praktikans() {
				var dataP = [];
				// var data = [
				// 	{'_id': 'u4745', 'nama': 'Doni', '_dudi': {'namaDudi': 'Dudi Alab-abal', 'alamat': 'Jalan Saja'}, '_guru': {'_id': 'gt03', 'nama': 'Andi Asmara'}},
				// 	{'_id': 'u4746', 'nama': 'Danang', '_dudi': {'namaDudi': 'Dudi Alab-abal', 'alamat': 'Jalan Saja'}, '_guru': {'_id': 'gt03', 'nama': 'Andi Asmara'}},
				// 	{'_id': 'u4746', 'nama': 'Dona', '_dudi': {'namaDudi': 'Dudi dfffb-abal', 'alamat': 'Jalan Kaki'}, '_guru': {'_id': 'gt02', 'nama': 'Dodik'}}
				// ]
				// 
				axios.get('http://localhost:4567/api/praktikans', { headers: { 'X-Access-Token': this.token }})
					.then(response => {
						var data = response.data;
						return data;
					})
					.then(dataPraktikans => {
						this.dataP = dataPraktikans;
					});

				return dataP;
			}
		}
	}
</script>

<style>
.tblSiswa {
	width: 100%;
}
.tblSiswa .tblContainer {
	margin-bottom: 20px;
}
.tblSiswa table {
	border-collapse: collapse;
	width: 100%;
}
.tblSiswa table th,
.tblSiswa table td {
	padding: 5px;
}
</style>