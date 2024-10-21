import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { countries, townships, postcodes } from './data-townships'

const TWZipCode = ({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) => {
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)
  const [postcode, setPostcode] = useState('')

  useEffect(() => {
    if (initPostcode) {
      setPostcode(initPostcode)
      for (let i = 0; i < postcodes.length; i++) {
        for (let j = 0; j < postcodes[i].length; j++) {
          if (postcodes[i][j] === initPostcode) {
            setCountryIndex(i)
            setTownshipIndex(j)
            return
          }
        }
      }
    }
  }, [initPostcode])

  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex])
    }
  }, [countryIndex, townshipIndex])

  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      )
    }
  }, [postcode])

  return (
    <>
      <Form.Group  controlId="formCountry" className="col-4 mb-3">
        <Form.Label>選擇縣市</Form.Label>
        <Form.Control
          as="select"
          value={countryIndex}
          onChange={(e) => {
            setCountryIndex(+e.target.value)
            setTownshipIndex(-1)
            setPostcode('')
          }}
        >
          <option value="-1">請選擇</option>
          {countries.map((value, index) => (
            <option key={index} value={index}>
              {value}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formTownship" className="col-4 mb-3">
        <Form.Label>選擇區域</Form.Label>
        <Form.Control
          as="select"
          value={townshipIndex}
          onChange={(e) => {
            setTownshipIndex(+e.target.value)
          }}
        >
          <option value="-1">請選擇</option>
          {countryIndex > -1 &&
            townships[countryIndex].map((value, index) => (
              <option key={index} value={index}>
                {value}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formPostcode" className="col-4 mb-3">
        <Form.Label>郵遞區號</Form.Label>
        <Form.Control type="text" value={postcode} readOnly />
      </Form.Group>
    </>
  )
}
export default TWZipCode
