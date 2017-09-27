#! /usr/bin/python

import sys
import subprocess
import xml.etree.ElementTree

def main():
    # US weather locations can be found:

    # weather.rap.ucar.edu/surface/stations.txt
    LOCATION_CODE = 'KBLM'

    FILE_NAME = LOCATION_CODE + '.xml'

    # {{{ Get XML
    
    # XML files containing weather information hosted at:
    # http://www.weather.gov/data/current_obs/[LOCATION CODE].xml

    URL = 'w1.weather.gov/xml/current_obs/' + FILE_NAME
    raw_data = subprocess.check_output(['curl', URL])
    
    # }}}

    # {{{ Parsing the XML data

    try:
        root = xml.etree.ElementTree.fromstring(raw_data)
    except xml.etree.ElementTree.ParseError:
        sys.stdout.write("| locerr ")
        return    

    station = root.find('station_id').text
    temp = root.find('temp_f').text + 'F'
    forecast = root.find('weather').text

    # }}}

    weather_widget = "| " + station + ": " + forecast + " " + temp + " "
    sys.stdout.write(weather_widget)

if __name__ == '__main__':
    main()
