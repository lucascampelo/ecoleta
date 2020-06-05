import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufsNames = response.data.map(uf => uf.sigla).sort();
            setUfs(ufsNames);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome).sort();

            setCities(cityNames);
        });
    }, [selectedUf]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
          uf: selectedUf,
          city: selectedCity
        });
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect
                  onValueChange={uf => setSelectedUf(uf)}
                  items={ufs.map(uf => ({ label: uf, value: uf}))}
                  placeholder={{label: "Selecione a UF", value: "0"}}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <Feather name="chevron-down" size={25} color="#DDD" />
                  }}
                  style={stylesSelect}
                />
                <RNPickerSelect
                  onValueChange={city => setSelectedCity(city)}
                  items={cities.map(city => ({ label: city, value: city}))}
                  placeholder={{label: "Selecione a Cidade", value: "0"}}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <Feather name="chevron-down" size={25} color="#DDD" />
                  }}
                  style={stylesSelect}
                  disabled={selectedUf === '0'}
                />
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Feather name="arrow-right" color="#FFF" size={24} />
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
}

const stylesSelect = StyleSheet.create({
  inputAndroid: {
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    color: '#AAA',
    marginBottom: 8
  },
  iconContainer: {
    top: 18,
    right: 16,
  }
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor: '#F0F0F5'
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
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
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

export default Home;
