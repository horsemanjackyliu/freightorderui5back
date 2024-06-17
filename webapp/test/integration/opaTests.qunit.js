sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'freightordermgt/test/integration/FirstJourney',
		'freightordermgt/test/integration/pages/ZC_FREIGHTORDERList',
		'freightordermgt/test/integration/pages/ZC_FREIGHTORDERObjectPage',
		'freightordermgt/test/integration/pages/ZC_FORDER_ITEMSObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZC_FREIGHTORDERList, ZC_FREIGHTORDERObjectPage, ZC_FORDER_ITEMSObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('freightordermgt') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZC_FREIGHTORDERList: ZC_FREIGHTORDERList,
					onTheZC_FREIGHTORDERObjectPage: ZC_FREIGHTORDERObjectPage,
					onTheZC_FORDER_ITEMSObjectPage: ZC_FORDER_ITEMSObjectPage
                }
            },
            opaJourney.run
        );
    }
);