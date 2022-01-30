# Finance DiscordBot

A bot made for finance server

## Commands

#### General

author  -  return information about the author<br>
api     -  return information about the api

help    - give you an embed with help

#### Symbols

*add-symbol [name] [symbol]* - link a symbol and a name<br>
*del-symbol [name / symbol]* - delete a symbol from the list<br>
*list-symbol*                - list the symbols

#### Finance command

*price [name / symbol] cm*              - return information about the cryptocurrency<br>
*price [name / symbol] co*              - return information about the organisation<br>
*price [name / symbol] [name / symbol]* - return information about the price of the first currency to the second

*historial [name / symbol] cm [d / w / m]*              - return graph of the price of the cryptocurrency in interval of 3th argument<br>
*historial [name / symbol] co [d / w / m]*              - return graph of the price of the cryptocurrency in interval of 3th argument<br>
*historial [name / symbol] [name / symbol] [d / w / m]* - return graph of the price of the first currency to the second in interval of 3th argument

#### Positive currency

*An example of price command for the bitcoin when it's going up*

![image1](https://user-images.githubusercontent.com/73474137/151710132-d04b8dbd-d681-40e2-b71b-a6b3ec50318d.png)

#### Negative currency

*An example of price command for the bitcoin when it's going down*

![image2](https://user-images.githubusercontent.com/73474137/151710197-7aa0698a-4e27-4d2e-aad0-a739e7257cdc.png)

#### Graph

*An example of graph for the bitcoin*

![image3](https://user-images.githubusercontent.com/73474137/151710161-4a610b06-a0dc-40d9-8143-1566a4e9fe0a.png)

## License

MIT License

Copyright (c) 2022 titi_2115

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
