sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'freightordermgt',
            componentId: 'ZC_FREIGHTORDERObjectPage',
            contextPath: '/ZC_FREIGHTORDER'
        },
        CustomPageDefinitions
    );
});