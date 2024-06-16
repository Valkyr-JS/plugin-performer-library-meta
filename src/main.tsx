import { GENDERS } from "./common/constants";
import DetailGroup from "./components/DetailGroup";
import ItemMostCommonTags from "./components/Item.CommonTags";
import ItemContentSize from "./components/ItemContentSize";
import ItemMostFeaturedOn from "./components/ItemMostFeaturedOn";
import ItemMostWorkedWith from "./components/ItemMostWorkedWith";
import ItemOCount from "./components/ItemOCount";
import ItemScenesOrganized from "./components/ItemScenesOrganized";
import ItemScenesTimespan from "./components/ItemScenesTimespan";
import ItemWatchedFor from "./components/ItemWatchedFor";
import "./styles.scss";

const { PluginApi } = window;
const { GQL, React } = PluginApi;

/* -------------------------------------------------------------------------- */
/*                               PluginApi patch                              */
/* -------------------------------------------------------------------------- */

PluginApi.patch.after(
  "PerformerDetailsPanel.DetailGroup",
  function ({ children, collapsed, performer }) {
    const performerID = performer.id;

    const qScenes = GQL.useFindScenesQuery({
      variables: {
        filter: { per_page: -1, sort: "date" },
        scene_filter: {
          performers: {
            modifier: CriterionModifier.Includes,
            value: [performerID],
          },
        },
      },
    });

    const qStats = GQL.useStatsQuery();

    // Only attach plugin component if scene data has been found. Otherwise,
    // return the original component only.
    if (
      !!qScenes.data &&
      qScenes.data.findScenes.scenes.length &&
      !!qStats.data &&
      performerID !== null
    ) {
      const scenesQueryResult = qScenes.data.findScenes;
      const statsQueryResult = qStats.data.stats;
      return [
        <>
          <DetailGroup>{children}</DetailGroup>
          <DetailGroup id="pluginPerformerLibraryMeta">
            <ItemContentSize
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemWatchedFor
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemScenesTimespan
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemScenesOrganized
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemMostWorkedWith
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
            {GENDERS.map((g) => (
              <ItemMostWorkedWith
                collapsed={collapsed}
                gender={g}
                performer={performer}
                scenesQueryResult={scenesQueryResult}
              />
            ))}
            <ItemMostFeaturedOn
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemMostCommonTags
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemOCount
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
              statsQueryResult={statsQueryResult}
            />
          </DetailGroup>
        </>,
      ];
    }

    return [<div className="detail-group">{children}</div>];
  }
);
