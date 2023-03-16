import React from 'react';
import WayfindingAppLink from '../components/WayfindingAppLink';
import { useCharges } from '../state/docket';
import { APPS, SECTIONS } from '../constants';

export default function GetApps() {
  const charges = useCharges();

  return (
    <div className="flex h-full flex-col space-y-8 overflow-y-scroll p-8">
      <h1 className="text-xl font-bold text-gray-800">Find Urbit Apps</h1>
      <div className="flex flex-col space-y-3">
        <h2 className="font-semibold text-gray-800">
          Find Urbit App Developers
        </h2>
        <span>
          Use the search field above to find apps or ships hosting apps.
        </span>
      </div>
      {Object.entries(SECTIONS).map(([key, name]) => (
        <div key={key} className="flex flex-col space-y-2">
          <h2 className="text-lg font-bold text-gray-800">{name}</h2>
          <div className="flex flex-col space-y-2 px-2">
            {APPS.map((app) => {
              if (app.section === name) {
                return (
                  <WayfindingAppLink
                    key={app.desk}
                    title={
                      charges[app.desk] ? charges[app.desk].title : app.title
                    }
                    description={
                      charges[app.desk]
                        ? charges[app.desk]?.info ?? app.description
                        : app.description
                    }
                    color={
                      charges[app.desk] ? charges[app.desk].color : app.color
                    }
                    image={
                      charges[app.desk]
                        ? charges[app.desk].image
                        : app.image ?? ''
                    }
                    link={charges[app.desk] ? app.link : ''}
                    installed={charges[app.desk] ? true : false}
                    source={app.source}
                    desk={app.desk}
                  />
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
