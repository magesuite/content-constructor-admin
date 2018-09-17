<?php


namespace MageSuite\ContentConstructorAdmin\Test\Fixture\LandingPage;


class Page extends \Magento\Mtf\Fixture\DataSource
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

        if (isset($data['dataset'])) {
            $page = $fixtureFactory->createByCode('cmsPage', ['dataset' => $data['dataset']]);

            $page->persist();
            
            $this->data = $page;
        } else {
            $this->data = $data;
        }
    }

}