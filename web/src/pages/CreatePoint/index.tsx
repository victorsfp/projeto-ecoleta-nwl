import React, { useEffect, useState , ChangeEvent, FormEvent } from 'react';
import { Link , useHistory } from 'react-router-dom';
import { FiArrowLeft , FiCheckCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";
import Modal from 'react-modal';
import api from '../../services/api';

import Dropzone from "../../components/Dropzone";
import refresh from "../../assets/refresh.png";

import axios from 'axios';


import './style.css';

import logo from "../../assets/logo.svg";

//aray ou objeto manualmente informar o tipo da variavel

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface IBGEUFReponse {
    sigla: string
}

interface IBGECityReponse {
    nome: string
}


const CreatePoint = () => {

    const customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            width: '40%',
            height: '70%',
            transform             : 'translate(-50%, -50%)', 
            border: 'nonse'   ,
            backgroundColor: 'transparent'
        }
    };

    
    const history = useHistory()
    const [items, setItems] = useState<Item[]>([]); //ou Array<Item> ou Item[]
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([]);
    const [resultInput, setResultInput] = useState<Boolean>(false);

    const [initialPostion, setInitalPosition] = useState<[number,number]>([0,0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [modalIsOpen,setIsOpen] = useState(false);

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const [selectedItems, setSelectedItems] = useState<Number[]>([])
    const [selectedPostion, setSelectedPosition] = useState<[number,number]>([0,0]);   
    const [selectedFile, setSeletedFile] = useState<File>();
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude , longitude } = position.coords;
            setInitalPosition([latitude, longitude])            
        })
    },[])

    

    useEffect(() => {
        api.get('items')
        .then((response) => {            
            setItems(response.data)            
        })
    },[]);
    
    useEffect(() => {
        axios.get<IBGEUFReponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials)
        })
    },[])

    useEffect(() => {
        if(selectedUf === "0"){
            return;
        }
        axios.get<IBGECityReponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames)
        })    
    },[selectedUf])

    function handelSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf)
    }

    function handelSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city)
    }

    function handelMapClick(event: LeafletMouseEvent){
        setSelectedPosition([event.latlng.lat, event.latlng.lng])        
    }

    function changeInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id: number){
        const alreadySeleted = selectedItems.findIndex(item => item === id);
        if(alreadySeleted >= 0){
            const filteredItems = selectedItems.filter (item => item !== id);
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems, id])
        }        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPostion;
        const items = selectedItems;

        const data = new FormData();        
        
        data.append('name',name);
        data.append('email',email);
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude',String(latitude));
        data.append('longitude',String(longitude));
        data.append('items',items.join(','));
        if(selectedFile){
            data.append('image', selectedFile);
        }
        
        setIsOpen(true);
        await api.post('points', data)
        setTimeout(() => {
            setIsOpen(false)
            setResultInput(true)
        }, 2000);
        // history.push('/'); //VOLTAR PARA ROTA DE INICIO
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header> 

            <Modal
                id="modalLoading"
                isOpen={modalIsOpen}                            
                style={customStyles}       
                contentLabel="Modal loading"
            >

                <div className="container-loading">
                <img src={refresh} alt="Loading" className="img-loading"/>
                </div>
                
            </Modal> 

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                

                <Dropzone onFileUploaded={setSeletedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={changeInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={changeInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={changeInputChange}
                            />
                        </div>
                    </div>                    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>                        
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPostion} zoom={15} onclick={handelMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPostion} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handelSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handelSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo.</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                                key={item.id} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt="Teste"/>
                                    <span>{item.name}</span>
                            </li>
                        ))}
                        
                        
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>


                {resultInput === true ? (
                    <div className="result-input">
                        <div className="span-loading">
                            <p><FiCheckCircle size={24}/></p>
                        </div>
                        <div className="content-loading">
                            <p>Ponto de coleta cadastrado com sucesso.</p>
                        </div>
                                            
                    </div>
                ) : ''}

                
            </form>

        </div>
    );
}

export default CreatePoint