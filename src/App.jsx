import './App.css'

import React from 'react'

import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

class Imc extends React.Component {

  constructor(props) {
    super(props);
    this.setPeso = this.setPeso.bind(this);
    this.setAltura = this.setAltura.bind(this);
    this.setMasculino = this.setMasculino.bind(this);
    this.setMaior = this.setMaior.bind(this);
    this.resultado = this.resultado.bind(this);
    this.enviar = this.enviar.bind(this);
    this.state = {
      peso: null,
      altura: null,
      masculino: false,
      maior: false
    };
  }

  setPeso(event) {
    this.setState({ peso: event.target.value });
  }

  setAltura(event) {
    this.setState({ altura: event.target.value });
  }

  setMasculino(event) {
    this.setState({ masculino: event.target.checked });
  }

  setMaior(event) {
    this.setState({ maior: event.target.checked });
  }

  calcular() {
    let peso = this.state.peso;
    let altura = this.state.altura;
    if (peso && altura) {
      return peso / Math.pow(altura, 2);
    }
  }

  tipo(imc, a, b, c, d, e) {
    if (imc < a) {
      return "Abaixo do peso";
    } else if (imc < b) {
      return "Peso normal";
    } else if (imc < c) {
      return "Acima do peso (sobrepeso)";
    } else if (imc < d) {
      return "Obesidade I";
    } else if (imc < e) {
      return "Obesidade II";
    } else {
      return "Obesidade III";
    }
  }

  classificar(maior, masculino, imc) {
    if (maior) {
        return this.tipo(imc, 18.5, 24.9, 29.9, 34.9, 39.9);
      } else if (masculino) {
        return this.tipo(imc, 17.8, 26.4, 30.6, 34.9, 39.9);
      } else {
        return this.tipo(imc, 16.9, 25.9, 30.7, 34.9, 39.9);
      }
  }

  resultado() {
    let resultado = new String();
    let imc = this.calcular();
    if (imc) {
      resultado += imc.toFixed(2) + " - ";
      let masculino = this.state.masculino;
      let maior = this.state.maior;
      resultado += this.classificar(maior, masculino, imc);
    }
    return resultado;
  }

  enviar() {
    let date = new Date().toISOString();
    date = date.replace(/([^T]+)T([^\.]+).*/g, '$1 $2');
    let imc = this.calcular();
    if (imc) {
      let masculino = this.state.masculino;
      let maior = this.state.maior;
      let peso = this.state.peso;
      let altura = this.state.altura;
      let tipo = this.classificar(maior, masculino, imc);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let requestOptions = {
          method: "post",
          headers: myHeaders,
          redirect: "follow",
          body: JSON.stringify([[date,imc,tipo,masculino,maior,peso,altura]])
      };
      fetch("<<link>?tabId=Dados", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
            }}
          >
            <Typography component="h1" variant="h5">
              Calculadora de IMC
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={this.setMasculino} />}
                label="Masculino"
              />
              <FormControlLabel
                control={<Switch onChange={this.setMaior} />}
                label="Maior de idade"
              />
            </FormGroup>
            <TextField
              onChange={this.setPeso}
              margin="normal"
              required
              fullWidth
              id="peso"
              label="Peso"
              name="peso"
              type="number"
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">kg</InputAdornment>,
              }}
            />
            <TextField
              onChange={this.setAltura}
              margin="normal"
              required
              fullWidth
              id="altura"
              label="Altura"
              name="altura"
              type="number"
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">m</InputAdornment>,
              }}
            />
            <Typography component="h1" variant="h6">
              {this.resultado()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'inline',
              alignItems: 'center',
            }}
          >
            <Button
              onClick={this.enviar}
              variant="contained">
              Enviar
            </Button>
            <Button
              href="<<link>"
              variant="contained">
              Relatório
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default function App() {
  return (
    <Imc />
  );
}
