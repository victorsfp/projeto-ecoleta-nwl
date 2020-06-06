import React , {useState, useEffect } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Image , StyleSheet, Text, TextInput , KeyboardAvoidingView , Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";

interface IBGEUFReponse {
    sigla: string
    nome: string
}

interface IBGECityReponse {
    nome: string
}

interface OptionsUFS {
    options: {
        label:string
        value:string
    }[]
}




const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] =  useState('');
    const [city, setCity] =  useState('');
    

    const [iconUf, setIconUf] = useState('arrow-down');
    const [iconCity, setIconCity] = useState('arrow-down');


    const [optionUf, setOptionsUf] = useState<OptionsUFS>( {
        options:[
            { label:'', value:'' }
        ]
    })

    const [optionCIty, setOptionsUCity] = useState<OptionsUFS>( {
        options:[
            { label:'', value:'' }
        ]
    })

    useEffect(() => {
        axios.get<IBGEUFReponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => {
            const ufInitials = response.data.map(ufs => {
                return {
                    label: ufs.nome,
                    value: ufs.sigla 
                }
            });
            setOptionsUf({...optionUf, options: ufInitials})
        })
    }, [])

    useEffect(() => {
        if(uf !== ""){
            axios.get<IBGECityReponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => {                
                const cityNames = response.data.map(city => {
                    return {
                        label: city.nome,
                        value: city.nome
                    }
                });
                setOptionsUCity({...optionCIty, options: cityNames})
                // setCities(cityNames)
            })  
        }
    }, [uf])

    function handleNavigateToPoints(){          
        if(uf === undefined){
            Alert.alert('Ecoleta - Dados inválidos','Por favor, selecione o estado');
        }else if(city ===  ''){
            Alert.alert('Ecoleta - Dados inválidos','Por favor, selecione a cidade');
        }else{
            navigation.navigate("Points", {
                uf,
                city
            });
        }        
    }

    return (
        <KeyboardAvoidingView
            style={{flex:1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground  
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{ width: 274, height:368 }}
        >
            
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <View>                    
                    <Text style={styles.title}> Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos a pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect  
                    style={pickerSelectStyles}
                    onOpen={() => setIconUf('arrow-up')}
                    onClose={() => setIconUf('arrow-down')}
                    placeholder={{
                        label: 'Selecione um estado',
                    }}
                    value={uf}
                    onValueChange={(value) => { setCity(''); setUf(value); }}
                    items={optionUf.options}
                    Icon={() => {
                        return <Icon name={iconUf} color="#6C6C80" size={20} />
                    }}
                />

                <RNPickerSelect  
                    style={pickerSelectStyles}
                    onOpen={() => setIconCity('arrow-up')}
                    onClose={() => setIconCity('arrow-down')}
                    placeholder={{
                        label: 'Selecione uma cidade',
                        value: null
                        }}
                    value={city}
                    onValueChange={(value) => setCity(value)}
                    items={optionCIty.options}
                    Icon={() => {
                        return <Icon name={iconCity} color="#6C6C80" size={20} />
                    }}
                />

                {/* <TextInput
                    style={styles.input}
                    placeholder="Digite a UF"
                    value={uf}
                    maxLength={2}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onChangeText={text => setUf(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Digite a Cidade"
                    autoCorrect={false}
                    onChangeText={setCity}
                /> */}

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}><Text><Icon name="arrow-right" color="#FFF" size={24} /></Text></View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>

        </ImageBackground>
        </KeyboardAvoidingView>
        
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
      inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
      iconContainer: {
        top: 20,
        right: 15,        
        fontSize:2        
      },
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,      
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
});

export default Home