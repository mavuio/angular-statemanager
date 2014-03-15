angular.module("werkzeugh-statemanager", []).factory "statemanager", [
  "$location"
  ($location) ->


    currentState={}
    stateUpdateCount=0

    updateLocationFromState = (state)->
      newLocation=getLocationForState(state)
      $location.path newLocation.path
      $location.hash newLocation.hash
      $location.search newLocation.search


    updateStateFromLocation = -> #TODO: make customizable

       currentLocation=
         path: $location.path()
         hash: $location.hash()+''
         search: $location.search()

       currentState.query=currentLocation.search

       currentState.hash=fromParams currentLocation.hash

       # console.log "location to state" , [currentLocation,currentState]  if window.console and console.log

       stateUpdateCount++

    getLocationForState = (state)->  #TODO: make customizable

      newLocation =
        search: null
        path: ''
        hash: ''

      newLocation.search = sanitizeQuery(state.query)
      newLocation.hash = toParams(state.hash)


      return newLocation

    sanitizeQuery = (query)->  #TODO: make customizable
      statequery={}
      angular.forEach query, (value, key) ->
        ok=true
        ok=false if key is 'page' and value < 2

        statequery[key]=value if value and ok

      return statequery

    toParams = (params) ->
      pairs = []
      do proc = (object=params, prefix=null) ->
        for own key, value of object
          if value instanceof Array
            for el, i in value
              proc(el, if prefix? then "#{prefix}[#{key}][]" else "#{key}[]")
          else if value instanceof Object
            if prefix?
              prefix += "[#{key}]"
            else
              prefix = key
            proc(value, prefix)
          else
            pairs.push(if prefix? then "#{prefix}[#{key}]=#{value}" else "#{key}=#{value}")
      pairs.join('&')

    fromParams = (str)->
      obj={}
      str.replace( new RegExp("([^?=&]+)(=([^&]*))?", "g"),($0, $1, $2, $3)->
          obj[$1] = $3
      )
      obj

    return (

      set: (key, value) ->

        console.log "set" , key,value  if window.console and console.log

        key_parts=key.split(/\./)
        currentState[key]=angular.copy(value)

        stateUpdateCount++
        updateLocationFromState(currentState)

      setState: (stateparams) ->
        console.log "setstate" ,stateparams  if window.console and console.log

        currentState=angular.copy(stateparams)
        stateUpdateCount++
        updateLocationFromState(currentState)

      get: (key) ->
        # console.log "get" ,currentState[key]  if window.console and console.log

        if stateUpdateCount is 0
          updateStateFromLocation()

        if currentState[key]?
          return currentState[key]

      getState: () ->
        currentState

      syncStateToUrl: () ->
        updateStateFromLocation()


      getLocation: () ->
        getLocationForState currentState

    )
]
