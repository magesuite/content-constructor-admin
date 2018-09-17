<?php

namespace MageSuite\ContentConstructorAdmin\Test\Fixture\ImageTeaser;

class Banners extends \Magento\Mtf\Fixture\DataSource {

    /**
     *
     * @param \Magento\Mtf\Repository\RepositoryFactory $repositoryFactory
     * @param \Magento\Mtf\Fixture\FixtureFactory $fixtureFactory
     * @param array $params
     * @param array $data
     */
    public function __construct(
        \Magento\Mtf\Repository\RepositoryFactory $repositoryFactory,
        \Magento\Mtf\Fixture\FixtureFactory $fixtureFactory,
        \MageSuite\ContentConstructorAdmin\Test\Assets\MediaDeployer $mediaDeployer,
        array $params,
        array $data = []
    ) {
        $this->params = $params;
        $this->data = $data;

        if(!empty($data)) {
            foreach($data as &$banner) {
                $targetLink = $banner['cta_target_link'];

                $banner['cta_target_link'] = $fixtureFactory->createByCode($targetLink['type'], ['dataset' => $targetLink['dataset']]);

                $banner['cta_target_link']->persist();

                $mediaDeployer->deploy($banner['image']);
            }

            $this->data = $data;
        }
    }


}