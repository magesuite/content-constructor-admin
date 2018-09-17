<?php


namespace MageSuite\ContentConstructorAdmin\Test\Fixture\LandingPage;


class Components extends \Magento\Mtf\Fixture\DataSource
{
    /**
     * @constructor
     * @param \Magento\Mtf\Fixture\FixtureFactory $fixtureFactory
     * @param array $params
     * @param array $data
     */
    public function __construct(\Magento\Mtf\Fixture\FixtureFactory $fixtureFactory, array $params, array $data = [])
    {
        $this->params = $params;

        foreach($data as $component) {
            $type = $component['type'];
            $return = ['type' => $type];

            $dataset = $component['dataset'];
            $fixture = $fixtureFactory->createByCode($type, ['dataset' => $dataset]);

            $fixture->persist();

            $return['data'] = $fixture;

            $this->data[] = $return;
        }
    }
}