import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import i18next from 'i18next';

// Configurar i18next con traducciones personalizadas
i18next.init({
  lng: 'es',
  resources: {
    es: {
      zod: {
        errors: {
          invalid_type: "Se esperaba {{expected}} pero se recibió {{received}}",
          invalid_type_received_undefined: "Este campo es requerido",
          invalid_literal: "Valor inválido, se esperaba {{expected}}",
          unrecognized_keys: "Claves no reconocidas en el objeto: {{keys}}",
          invalid_union: "Valor inválido",
          invalid_union_discriminator: "Valor discriminador inválido. Se esperaba {{options}}",
          invalid_enum_value: "Valor inválido. Se esperaba {{options}}, se recibió '{{received}}'",
          invalid_arguments: "Argumentos de función inválidos",
          invalid_return_type: "Tipo de retorno de función inválido",
          invalid_date: "Fecha inválida",
          invalid_string: "{{validation}} inválido",
          too_small: {
            array: {
              exact: "La lista debe contener exactamente {{minimum}} elemento(s)",
              inclusive: "La lista debe contener al menos {{minimum}} elemento(s)",
              not_inclusive: "La lista debe contener más de {{minimum}} elemento(s)"
            },
            string: {
              exact: "La cadena debe contener exactamente {{minimum}} carácter(es)",
              inclusive: "La cadena debe contener al menos {{minimum}} carácter(es)",
              not_inclusive: "La cadena debe contener más de {{minimum}} carácter(es)"
            },
            number: {
              exact: "El número debe ser exactamente {{minimum}}",
              inclusive: "El número debe ser mayor o igual que {{minimum}}",
              not_inclusive: "El número debe ser mayor que {{minimum}}"
            },
            set: {
              exact: "Entrada inválida",
              inclusive: "Entrada inválida",
              not_inclusive: "Entrada inválida"
            },
            date: {
              exact: "La fecha debe ser exactamente {{minimum, datetime}}",
              inclusive: "La fecha debe ser mayor o igual que {{minimum, datetime}}",
              not_inclusive: "La fecha debe ser mayor que {{minimum, datetime}}"
            }
          },
          too_big: {
            array: {
              exact: "La lista debe contener exactamente {{maximum}} elemento(s)",
              inclusive: "La lista debe contener como máximo {{maximum}} elemento(s)",
              not_inclusive: "La lista debe contener menos de {{maximum}} elemento(s)"
            },
            string: {
              exact: "La cadena debe contener exactamente {{maximum}} carácter(es)",
              inclusive: "La cadena debe contener como máximo {{maximum}} carácter(es)",
              not_inclusive: "La cadena debe contener menos de {{maximum}} carácter(es)"
            },
            number: {
              exact: "El número debe ser exactamente {{maximum}}",
              inclusive: "El número debe ser menor o igual que {{maximum}}",
              not_inclusive: "El número debe ser menor que {{maximum}}"
            },
            set: {
              exact: "Entrada inválida",
              inclusive: "Entrada inválida",
              not_inclusive: "Entrada inválida"
            },
            date: {
              exact: "La fecha debe ser exactamente {{maximum, datetime}}",
              inclusive: "La fecha debe ser menor o igual que {{maximum, datetime}}",
              not_inclusive: "La fecha debe ser menor que {{maximum, datetime}}"
            }
          },
          custom: "Entrada inválida",
          invalid_intersection_types: "Los resultados de la intersección no se pudieron combinar",
          not_multiple_of: "El número debe ser múltiplo de {{multipleOf}}",
          not_finite: "El número debe ser finito"
        },
        validations: {
          email: "Email inválido",
          url: "URL inválida",
          uuid: "UUID inválido",
          cuid: "CUID inválido",
          regex: "Inválido"
        }
      }
    }
  }
});

// Aplicar el mapa de i18n a Zod
z.setErrorMap(zodI18nMap);

export default z;